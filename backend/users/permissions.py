from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Admin ko sab kuch allowed hai"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'admin'
        )

class IsTeacherOrAdmin(permissions.BasePermission):
    """Teacher aur Admin dono ko allow karne ke liye"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'profile'):
            return False
            
        return request.user.profile.role in ['admin', 'teacher']

class IsStudentUser(permissions.BasePermission):
    """Student sirf apna data dekh sakta hai"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'student'
        )