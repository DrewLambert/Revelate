#!/bin/bash

# Spotify User CLI - Access personal listening data
# Usage: ./spotify-user-cli.sh [command] [options]

SPOTIFY_CLIENT_ID="387a3bfe7fb548838d467b0117315043"
SPOTIFY_CLIENT_SECRET="a7324dd4c0b8474092043a1f4a97332e"
TOKEN_FILE="$HOME/.spotify_tokens"

# Check if token file exists
if [ ! -f "$TOKEN_FILE" ]; then
    echo "Error: No tokens found. Please run ./spotify-auth.sh first to authenticate."
    exit 1
fi

# Load tokens
source "$TOKEN_FILE"

# Function to refresh access token if needed
refresh_token() {
    echo "Refreshing access token..." >&2
    TOKEN_RESPONSE=$(curl -s -X POST "https://accounts.spotify.com/api/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=refresh_token&refresh_token=$REFRESH_TOKEN&client_id=$SPOTIFY_CLIENT_ID&client_secret=$SPOTIFY_CLIENT_SECRET")

    NEW_ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

    if [ -n "$NEW_ACCESS_TOKEN" ]; then
        ACCESS_TOKEN=$NEW_ACCESS_TOKEN
        # Update token file
        echo "ACCESS_TOKEN=$ACCESS_TOKEN" > "$TOKEN_FILE"
        echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> "$TOKEN_FILE"
        echo "Token refreshed successfully!" >&2
    fi
}

# Commands
case "$1" in
    history|recent)
        LIMIT=${2:-20}
        echo "Fetching your last $LIMIT played tracks..."
        RESPONSE=$(curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=$LIMIT" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        # Check if token expired
        if echo "$RESPONSE" | grep -q "token expired"; then
            refresh_token
            RESPONSE=$(curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=$LIMIT" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        echo "$RESPONSE" | jq -r '.items[] | "\(.played_at | split("T")[0]) \(.played_at | split("T")[1] | split(".")[0]) - \(.track.name) by \(.track.artists[0].name)"'
        ;;

    history-json)
        LIMIT=${2:-50}
        echo "Fetching your last $LIMIT played tracks (JSON format)..."
        RESPONSE=$(curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=$LIMIT" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        if echo "$RESPONSE" | grep -q "token expired"; then
            refresh_token
            RESPONSE=$(curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=$LIMIT" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        echo "$RESPONSE" | jq '.items[] | {played_at: .played_at, track: .track.name, artist: .track.artists[0].name, album: .track.album.name, duration_ms: .track.duration_ms}'
        ;;

    top-artists)
        TIMEFRAME=${2:-medium_term}
        LIMIT=${3:-20}
        echo "Fetching your top $LIMIT artists ($TIMEFRAME)..."
        echo "Timeframe options: short_term (4 weeks), medium_term (6 months), long_term (years)"
        RESPONSE=$(curl -s "https://api.spotify.com/v1/me/top/artists?time_range=$TIMEFRAME&limit=$LIMIT" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        if echo "$RESPONSE" | grep -q "token expired"; then
            refresh_token
            RESPONSE=$(curl -s "https://api.spotify.com/v1/me/top/artists?time_range=$TIMEFRAME&limit=$LIMIT" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        echo "$RESPONSE" | jq -r '.items[] | "\(.name) - \(.genres[0:2] | join(", "))"'
        ;;

    top-tracks)
        TIMEFRAME=${2:-medium_term}
        LIMIT=${3:-20}
        echo "Fetching your top $LIMIT tracks ($TIMEFRAME)..."
        echo "Timeframe options: short_term (4 weeks), medium_term (6 months), long_term (years)"
        RESPONSE=$(curl -s "https://api.spotify.com/v1/me/top/tracks?time_range=$TIMEFRAME&limit=$LIMIT" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        if echo "$RESPONSE" | grep -q "token expired"; then
            refresh_token
            RESPONSE=$(curl -s "https://api.spotify.com/v1/me/top/tracks?time_range=$TIMEFRAME&limit=$LIMIT" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        echo "$RESPONSE" | jq -r '.items[] | "\(.name) by \(.artists[0].name)"'
        ;;

    currently-playing)
        echo "Fetching currently playing track..."
        RESPONSE=$(curl -s "https://api.spotify.com/v1/me/player/currently-playing" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        if echo "$RESPONSE" | grep -q "token expired"; then
            refresh_token
            RESPONSE=$(curl -s "https://api.spotify.com/v1/me/player/currently-playing" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        if [ -z "$RESPONSE" ]; then
            echo "Nothing is currently playing."
        else
            echo "$RESPONSE" | jq '{track: .item.name, artist: .item.artists[0].name, album: .item.album.name, progress_ms: .progress_ms, duration_ms: .item.duration_ms, is_playing: .is_playing}'
        fi
        ;;

    profile)
        echo "Fetching your Spotify profile..."
        RESPONSE=$(curl -s "https://api.spotify.com/v1/me" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        if echo "$RESPONSE" | grep -q "token expired"; then
            refresh_token
            RESPONSE=$(curl -s "https://api.spotify.com/v1/me" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        echo "$RESPONSE" | jq '{display_name: .display_name, email: .email, country: .country, followers: .followers.total, product: .product}'
        ;;

    stats)
        echo "Generating your listening statistics..."
        echo ""

        # Get recent tracks
        RECENT=$(curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=50" \
            -H "Authorization: Bearer $ACCESS_TOKEN")

        if echo "$RECENT" | grep -q "token expired"; then
            refresh_token
            RECENT=$(curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=50" \
                -H "Authorization: Bearer $ACCESS_TOKEN")
        fi

        echo "Last 50 plays:"
        echo "$RECENT" | jq -r '[.items[].track.artists[0].name] | group_by(.) | map({artist: .[0], plays: length}) | sort_by(.plays) | reverse | .[0:10] | .[] | "  \(.plays)x - \(.artist)"'
        ;;

    refresh)
        refresh_token
        ;;

    help|*)
        echo "Spotify User CLI - Available Commands:"
        echo ""
        echo "  history [limit]                   Get recently played tracks (default: 20)"
        echo "  history-json [limit]              Get recently played tracks in JSON format"
        echo "  top-artists [timeframe] [limit]   Get your top artists"
        echo "  top-tracks [timeframe] [limit]    Get your top tracks"
        echo "  currently-playing                 Get currently playing track"
        echo "  profile                           Get your Spotify profile info"
        echo "  stats                             Generate listening statistics"
        echo "  refresh                           Refresh access token"
        echo "  help                              Show this help message"
        echo ""
        echo "Timeframe options for top-artists/top-tracks:"
        echo "  short_term    Last 4 weeks"
        echo "  medium_term   Last 6 months (default)"
        echo "  long_term     Several years"
        echo ""
        echo "Examples:"
        echo "  $0 history 50"
        echo "  $0 top-artists short_term 10"
        echo "  $0 top-tracks long_term 20"
        echo "  $0 stats"
        ;;
esac
