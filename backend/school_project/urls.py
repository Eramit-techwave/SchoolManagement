from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Step 3: Naya custom view import karo
from users.views import MyTokenObtainPairView 
from rest_framework_simplejwt.views import TokenRefreshView

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username=username).exists():
        return Response({'username': ['Username already exists!']}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    # Default: User register hote hi uska UserProfile bhi backend mein create hona chahiye (ispe hum baad mein kaam karenge)
    return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ✅ STEP 3 Updated: Ab yahan custom MyTokenObtainPairView use ho raha hai
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App URLs
    path('api/', include('students.urls')),
    path('api/', include('teachers.urls')),
    path('api/', include('attendance.urls')),
    path('api/eye/', include('eye_auth.urls')),
    path('api/auth/', include('users.urls')),
    path('api/auth/register/', register_user),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)