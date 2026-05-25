from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    # PDF ke mutabik teen roles honge
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    
    # Ye link karega Django ke default User se
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    
    # Extra fields (optional: agar user ko sidha student table se connect karna ho)
    # student_link = models.ForeignKey('students.Student', on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"