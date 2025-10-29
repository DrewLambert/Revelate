#!/bin/bash

# Spotify OAuth Authentication Helper
# This script helps you get a user access token for personal data access

SPOTIFY_CLIENT_ID="387a3bfe7fb548838d467b0117315043"
SPOTIFY_CLIENT_SECRET="a7324dd4c0b8474092043a1f4a97332e"
REDIRECT_URI="http://127.0.0.1:8888/callback"

# Required scopes for listening history
SCOPES="user-read-recently-played user-top-read user-read-playback-state user-read-currently-playing"

echo "==========================================="
echo "Spotify User Authentication Setup"
echo "==========================================="
echo ""
echo "STEP 1: Update your Spotify App Settings"
echo "----------------------------------------"
echo "Go to: https://developer.spotify.com/dashboard"
echo "Select your app and click 'Settings'"
echo "Add this Redirect URI: $REDIRECT_URI"
echo ""
echo "Press Enter when you've added the redirect URI..."
read -r

# Generate authorization URL
AUTH_URL="https://accounts.spotify.com/authorize"
SCOPE_ENCODED=$(echo "$SCOPES" | sed 's/ /%20/g')
AUTH_FULL_URL="${AUTH_URL}?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE_ENCODED}"

echo ""
echo "STEP 2: Authorize the Application"
echo "-----------------------------------"
echo "Opening authorization URL in your browser..."
echo ""
echo "URL: $AUTH_FULL_URL"
echo ""

# Try to open the URL in the default browser
if command -v open &> /dev/null; then
    open "$AUTH_FULL_URL"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$AUTH_FULL_URL"
else
    echo "Please manually open this URL in your browser:"
    echo "$AUTH_FULL_URL"
fi

echo ""
echo "After authorizing, you'll be redirected to:"
echo "$REDIRECT_URI?code=..."
echo ""
echo "Copy the ENTIRE URL from your browser and paste it here:"
read -r CALLBACK_URL

# Extract the authorization code
AUTH_CODE=$(echo "$CALLBACK_URL" | grep -o 'code=[^&]*' | cut -d'=' -f2)

if [ -z "$AUTH_CODE" ]; then
    echo "Error: Could not extract authorization code from URL"
    exit 1
fi

echo ""
echo "STEP 3: Exchange Code for Access Token"
echo "---------------------------------------"

# Exchange authorization code for access token
TOKEN_RESPONSE=$(curl -s -X POST "https://accounts.spotify.com/api/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=authorization_code&code=$AUTH_CODE&redirect_uri=$REDIRECT_URI&client_id=$SPOTIFY_CLIENT_ID&client_secret=$SPOTIFY_CLIENT_SECRET")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"refresh_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Error: Failed to get access token"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

# Save tokens to file
echo "ACCESS_TOKEN=$ACCESS_TOKEN" > ~/.spotify_tokens
echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> ~/.spotify_tokens

echo ""
echo "✓ Success! Your tokens have been saved to ~/.spotify_tokens"
echo ""
echo "Access Token: ${ACCESS_TOKEN:0:30}..."
echo "Refresh Token: ${REFRESH_TOKEN:0:30}..."
echo ""
echo "You can now use the spotify-user-cli.sh script to access your listening history!"
