from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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
    is_approved = models.BooleanField(default=False, help_text="Student account must be approved by admin")
    
    # Extra fields (optional: agar user ko sidha student table se connect karna ho)
    # student_link = models.ForeignKey('students.Student', on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"


class UserActivity(models.Model):
    """
    Enterprise-grade user activity tracking system
    Logs: Login, Logout, Page visits, Actions, Time spent
    """
    ACTIVITY_TYPES = [
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('PAGE_VIEW', 'Page View'),
        ('ACTION', 'User Action'),
        ('DATA_MODIFY', 'Data Modification'),
        ('DATA_DELETE', 'Data Deletion'),
        ('SEARCH', 'Search Query'),
        ('DOWNLOAD', 'Download'),
        ('ERROR', 'System Error'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    page_or_action = models.CharField(max_length=255, help_text="Page URL or action name")
    description = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    duration_seconds = models.IntegerField(blank=True, null=True, help_text="Time spent on page/action")
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['activity_type', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} - {self.timestamp}"


class UserSession(models.Model):
    """
    Track active user sessions with detailed metrics
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    total_actions = models.IntegerField(default=0)
    pages_visited = models.IntegerField(default=0)
    session_token = models.CharField(max_length=255, unique=True)
    
    class Meta:
        ordering = ['-login_time']
        indexes = [
            models.Index(fields=['user', '-login_time']),
            models.Index(fields=['is_active']),
        ]
    
    @property
    def session_duration(self):
        """Calculate total session duration"""
        end_time = self.logout_time or timezone.now()
        return (end_time - self.login_time).total_seconds()
    
    def __str__(self):
        return f"{self.user.username} - {self.login_time.strftime('%Y-%m-%d %H:%M:%S')}"