from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import Room,ValidName
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        
        if code is not None:
            room = Room.objects.filter(code=code).first()
            if room:
                data = RoomSerializer(room).data
                data['is_host'] = self.request.session.session_key == room.host
                names = UserAttributes.objects.filter(room=room)
                packet = {
                    'id': data['id'],
                    'is_host': data['is_host'],
                    'guest_can_pause': data['guest_can_pause'],
                    'votes_to_skip': data['votes_to_skip'],
                    'created_at': data['created_at'],
                    'code': data['code'],
                    'names': list(names.values_list('name', flat=True)),  # Assuming UserAttributes has a 'name' field
                }
                
                return JsonResponse(packet, status=status.HTTP_200_OK)

            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self,request,format=None):
       if not self.request.session.exists(self.request.session.session_key):
           self.request.session.create()
       data={
           'code':self.request.session.get('room_code')
       }
       return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            room_code = self.request.session.pop('room_code')
            user_id = self.request.session.session_key
            attributes = UserAttributes.objects.filter(user=user_id)
            if attributes.exists():
                attributes.delete()

            room = Room.objects.filter(code=room_code).first()
            if room:
                # Check if the user leaving is the host
                if room.host == user_id:
                    room.delete()
                    return Response({'message': 'Room deleted as host left'}, status=status.HTTP_200_OK)
                else:
                    # Check if there are any users left in the room
                    if not UserAttributes.objects.filter(room=room).exists():
                        room.delete()
                        return Response({'message': 'Room deleted as no users left'}, status=status.HTTP_200_OK)
            
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Room code not found in session'}, status=status.HTTP_400_BAD_REQUEST)

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class AddNames(APIView):
    serializer_class = UserDetailsSerializer
    def post(self,request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room_code=self.request.session.get('room_code')
            room=Room.objects.filter(code=room_code)[0]

            name=serializer.data.get('name')
            print(name)
            nameStatus=ValidName(name,self.request.session.session_key,room_code)
            if nameStatus==True:
                print(name)
                userdetails=UserAttributes(user=self.request.session.session_key,room=room,name=name)
                userdetails.save()
            else:
                print(nameStatus)
                return Response(nameStatus, 
                                status=status.HTTP_400_BAD_REQUEST)
            self.request.session['userName'] = name
            return Response({'Message':'Success'},status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    



class KickUser(APIView):
    pass

