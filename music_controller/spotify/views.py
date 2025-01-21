from django.shortcuts import render, redirect
from requests import Request, post
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from .util import (is_spotify_authenticated, update_or_create_user_tokens,
                   get_user_tokens, refresh_spotify_token,
                   pause_song, play_song, skip_song, execute_spotify_api_request)
from api.models import Room
from .models import Vote

class AuthURL(APIView):
    def get(self, request, format=None):
        # Include 'streaming' so that the user can use Web Playback
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming'
        
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')

    # If no session, create one
    if not request.session.exists(request.session.session_key):
        request.session.create()

    # Save or update tokens in DB
    update_or_create_user_tokens(
        request.session.session_key,
        access_token,
        token_type,
        expires_in,
        refresh_token
    )

    # Redirect back to your frontend
    return redirect('frontend:')


class isAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if not room.exists():
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        room = room[0]
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
       
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        votes = len(Vote.objects.filter(room=room, song_id=room.current_song))
        artist_string = ""
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            artist_string += artist.get("name")

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'image_url': album_cover,
            'is_playing': is_playing,
            'time': progress,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)
        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song
        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            Vote.objects.filter(room=room).delete()


class PauseSong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        # Host or guest_can_pause can pause
        if (self.request.session.session_key == room.host) or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        if (self.request.session.session_key == room.host) or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or (len(votes) + 1 >= votes_needed):
            votes.delete()
            skip_song(room.host)
        else:
            existing_vote = Vote.objects.filter(
                user=self.request.session.session_key, room=room, song_id=room.current_song
            ).first()
            if existing_vote:
                existing_vote.delete()
                return Response({'detail': 'Vote deleted'}, status=status.HTTP_204_NO_CONTENT)
            vote = Vote(
                user=self.request.session.session_key,
                room=room,
                song_id=room.current_song
            )
            vote.save()

        return Response({}, status=status.HTTP_204_NO_CONTENT)


# NEW: Provide a "GetPlaybackToken" for any user (host or guest) to fetch a valid token
class GetPlaybackToken(APIView):
    """
    Returns the user's current Spotify access token so they can 
    use the Web Playback SDK in the browser.
    """
    def get(self, request, format=None):
        session_key = self.request.session.session_key
        if not session_key:
            return Response({'error': 'No active session'}, status=status.HTTP_403_FORBIDDEN)
        is_spotify_authenticated(session_key)
        tokens = get_user_tokens(session_key)
        if not tokens:
            return Response({'error': 'User not authenticated with Spotify'}, status=status.HTTP_403_FORBIDDEN)
        
        return Response({'access_token': tokens.access_token}, status=status.HTTP_200_OK)
