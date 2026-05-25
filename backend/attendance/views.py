from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import AttendanceSerializer
from users.permissions import IsTeacherOrAdmin

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # 1. Attendance mark karne/delete karne ke liye sirf Admin/Teacher
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsTeacherOrAdmin()]
        
        # 2. Attendance dekhne ke liye koi bhi logged-in user
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Attendance.objects.all()
        student = self.request.query_params.get('student')
        date = self.request.query_params.get('date')
        if student:
            queryset = queryset.filter(student=student)
        if date:
            queryset = queryset.filter(date=date)
        return queryset