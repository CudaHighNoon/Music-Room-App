from django.db import models
import string
import random

def generate_unique_code():
    length=6
    while True:
        code=''.join(random.choices(string.ascii_uppercase,k=length))
        print(code)
        if Room.objects.filter(code=code).count()==0:
            break
    return code
def ValidName(name, user_id, code_=""):
    if len(name) == 0 or len(name) > 15:
        return {"Bad Request": "Name Surpasses 15 Character Limit"}
    if UserAttributes.objects.filter(name=name).exists():
        return {"Bad Request": "User is connected from another endpoint"}
    if UserAttributes.objects.filter(user=user_id).exists():
        return {"Bad Request": "User is connected from another endpoint"}
    return True
    
    

# Create your models here.
class Room(models.Model):
    code=models.CharField(max_length=8, default=generate_unique_code,unique=True)
    host=models.CharField(max_length=50,unique=True)
    guest_can_pause=models.BooleanField(null=False,default=False)
    votes_to_skip=models.IntegerField(null=False,default=1)
    created_at=models.DateTimeField(auto_now_add=True)
    current_song=models.CharField(max_length=50,null=True)


class UserAttributes(models.Model):
    user=models.CharField(max_length=50,unique=True)
    name=models.CharField(max_length=15,default="")
    room=models.ForeignKey(Room,on_delete=models.CASCADE)

