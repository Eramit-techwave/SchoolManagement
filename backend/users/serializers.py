from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Token ke andar Role add kar rahe hain
        token['role'] = user.profile.role
        token['username'] = user.username
        
        return token