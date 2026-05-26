from django.shortcuts import render

# Create your views here.
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # 1. Standard login (tokens generate honge)
        response = super().post(request, *args, **kwargs)
        
        # 2. User ka role manual response mein dalo
        try:
            username = request.data.get('username')
            user = User.objects.get(username=username)
            
            # Yahan hum response mein 'role' aur 'username' extra bhej rahe hain
            if hasattr(user, 'profile'):
                response.data['role'] = user.profile.role
            else:
                # If profile doesn't exist, create it and default to student
                from .models import UserProfile
                profile = UserProfile.objects.create(user=user, role='student')
                response.data['role'] = profile.role
            
            response.data['username'] = user.username
        except Exception as e:
            # Fallback to student role if anything goes wrong
            response.data['role'] = 'student'
            response.data['username'] = request.data.get('username', 'unknown')
            
        return response

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    GET: Current user ka profile data bhej
    PUT: Profile update karo
    """
    user = request.user
    
    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.profile.role if hasattr(user, 'profile') else 'student'
        })
    
    elif request.method == 'PUT':
        user.email = request.data.get('email', user.email)
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.save()
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.profile.role if hasattr(user, 'profile') else 'student',
            'message': 'Profile updated successfully!'
        }, status=status.HTTP_200_OK)