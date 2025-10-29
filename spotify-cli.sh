#!/bin/bash

# Spotify CLI - Simple command-line interface for Spotify Web API
# Usage: ./spotify-cli.sh [command] [query]

SPOTIFY_CLIENT_ID="387a3bfe7fb548838d467b0117315043"
SPOTIFY_CLIENT_SECRET="a7324dd4c0b8474092043a1f4a97332e"

# Function to get access token
get_token() {
    TOKEN_RESPONSE=$(curl -s -X POST "https://accounts.spotify.com/api/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials&client_id=$SPOTIFY_CLIENT_ID&client_secret=$SPOTIFY_CLIENT_SECRET")

    ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo $ACCESS_TOKEN
}

# Get fresh token
TOKEN=$(get_token)

if [ -z "$TOKEN" ]; then
    echo "Error: Failed to get access token"
    exit 1
fi

# Commands
case "$1" in
    search-artist)
        if [ -z "$2" ]; then
            echo "Usage: $0 search-artist <artist-name>"
            exit 1
        fi
        QUERY=$(echo "$2" | sed 's/ /%20/g')
        curl -s "https://api.spotify.com/v1/search?q=$QUERY&type=artist&limit=5" \
            -H "Authorization: Bearer $TOKEN" | jq '.artists.items[] | {name: .name, id: .id, followers: .followers.total, genres: .genres}'
        ;;

    search-track)
        if [ -z "$2" ]; then
            echo "Usage: $0 search-track <track-name>"
            exit 1
        fi
        QUERY=$(echo "$2" | sed 's/ /%20/g')
        curl -s "https://api.spotify.com/v1/search?q=$QUERY&type=track&limit=5" \
            -H "Authorization: Bearer $TOKEN" | jq '.tracks.items[] | {name: .name, artist: .artists[0].name, album: .album.name, id: .id}'
        ;;

    artist-info)
        if [ -z "$2" ]; then
            echo "Usage: $0 artist-info <artist-id>"
            exit 1
        fi
        curl -s "https://api.spotify.com/v1/artists/$2" \
            -H "Authorization: Bearer $TOKEN" | jq '{name: .name, genres: .genres, followers: .followers.total, popularity: .popularity, url: .external_urls.spotify}'
        ;;

    track-info)
        if [ -z "$2" ]; then
            echo "Usage: $0 track-info <track-id>"
            exit 1
        fi
        curl -s "https://api.spotify.com/v1/tracks/$2" \
            -H "Authorization: Bearer $TOKEN" | jq '{name: .name, artists: [.artists[].name], album: .album.name, duration_ms: .duration_ms, popularity: .popularity, url: .external_urls.spotify}'
        ;;

    artist-top-tracks)
        if [ -z "$2" ]; then
            echo "Usage: $0 artist-top-tracks <artist-id>"
            exit 1
        fi
        curl -s "https://api.spotify.com/v1/artists/$2/top-tracks?market=US" \
            -H "Authorization: Bearer $TOKEN" | jq '.tracks[] | {name: .name, album: .album.name, popularity: .popularity}'
        ;;

    playlist)
        if [ -z "$2" ]; then
            echo "Usage: $0 playlist <playlist-id>"
            exit 1
        fi
        curl -s "https://api.spotify.com/v1/playlists/$2" \
            -H "Authorization: Bearer $TOKEN" | jq '{name: .name, description: .description, owner: .owner.display_name, followers: .followers.total, tracks: .tracks.total}'
        ;;

    recommendations)
        if [ -z "$2" ]; then
            echo "Usage: $0 recommendations <seed-artist-id>"
            exit 1
        fi
        curl -s "https://api.spotify.com/v1/recommendations?seed_artists=$2&limit=10" \
            -H "Authorization: Bearer $TOKEN" | jq '.tracks[] | {name: .name, artist: .artists[0].name, album: .album.name}'
        ;;

    token)
        echo "Access Token: $TOKEN"
        echo "Expires in: 3600 seconds (1 hour)"
        ;;

    help|*)
        echo "Spotify CLI - Available Commands:"
        echo ""
        echo "  search-artist <name>          Search for artists"
        echo "  search-track <name>           Search for tracks"
        echo "  artist-info <id>              Get artist information"
        echo "  track-info <id>               Get track information"
        echo "  artist-top-tracks <id>        Get artist's top tracks"
        echo "  playlist <id>                 Get playlist information"
        echo "  recommendations <artist-id>   Get recommendations based on artist"
        echo "  token                         Display current access token"
        echo "  help                          Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 search-artist \"Taylor Swift\""
        echo "  $0 search-track \"Bohemian Rhapsody\""
        echo "  $0 artist-top-tracks 4Z8W4fKeB5YxbusRsdQVPb"
        ;;
esac
