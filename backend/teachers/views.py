from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Staff
from .serializers import StaffSerializer
from users.permissions import IsAdmin, IsTeacherOrAdmin

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    
    # Ye batata hai ki user ka logged in hona zaroori hai
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # 1. Staff add karne, badalne ya delete karne ke liye sirf Admin
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        
        # 2. Staff ki list dekhne ke liye Admin ya Teacher
        return [IsTeacherOrAdmin()]