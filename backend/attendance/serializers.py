from rest_framework import serializers
from .models import Attendance
from students.serializers import StudentSerializer
from teachers.serializers import StaffSerializer

class AttendanceSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    teacher_detail = StaffSerializer(source='teacher', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'