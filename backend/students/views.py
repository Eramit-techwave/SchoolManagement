from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Student
from .serializers import StudentSerializer
from users.permissions import IsTeacherOrAdmin, IsAdmin

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        # 1. Students add karne, badalne ya delete karne ke liye sirf Admin/Teacher
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsTeacherOrAdmin()]
        
        # 2. Students ki list dekhne ke liye koi bhi logged-in user
        return [IsAuthenticated()]