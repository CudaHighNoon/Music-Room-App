from django.shortcuts import render
from rest_framework import generics
from.serializers import RoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer

class CreateRoomView(APIView):
    serializer_class=CreateRoomSerializer
    def post(self,request,format=None):
        pass