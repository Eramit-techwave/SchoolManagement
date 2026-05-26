"""
Enterprise-grade user activity tracking utilities
Tracks login, logout, page visits, actions, and system events
"""

from datetime import datetime
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import UserActivity, UserSession
import json


class ActivityTracker:
    """
    Professional activity tracking system for monitoring user behavior
    """
    
    @staticmethod
    def get_client_ip(request):
        """Extract client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @staticmethod
    def get_user_agent(request):
        """Extract user agent from request"""
        return request.META.get('HTTP_USER_AGENT', '')
    
    @staticmethod
    def log_activity(user, activity_type, page_or_action, request=None, 
                     description='', duration_seconds=None):
        """
        Log user activity to database
        
        Args:
            user: User object
            activity_type: Type of activity (LOGIN, LOGOUT, PAGE_VIEW, ACTION, etc.)
            page_or_action: URL or action name
            request: HTTP request object (optional, for IP and user agent)
            description: Additional description
            duration_seconds: Time spent on page/action
        """
        try:
            ip_address = ActivityTracker.get_client_ip(request) if request else None
            user_agent = ActivityTracker.get_user_agent(request) if request else ''
            
            activity = UserActivity.objects.create(
                user=user,
                activity_type=activity_type,
                page_or_action=page_or_action,
                description=description,
                ip_address=ip_address,
                user_agent=user_agent,
                duration_seconds=duration_seconds
            )
            return activity
        except Exception as e:
            print(f"Error logging activity: {str(e)}")
            return None
    
    @staticmethod
    def create_session(user, request=None):
        """
        Create a new user session on login
        
        Returns:
            UserSession object
        """
        try:
            import uuid
            session_token = str(uuid.uuid4())
            ip_address = ActivityTracker.get_client_ip(request) if request else None
            user_agent = ActivityTracker.get_user_agent(request) if request else ''
            
            session = UserSession.objects.create(
                user=user,
                ip_address=ip_address,
                user_agent=user_agent,
                session_token=session_token,
                is_active=True
            )
            
            # Log login activity
            ActivityTracker.log_activity(
                user=user,
                activity_type='LOGIN',
                page_or_action='/login',
                request=request,
                description=f'User logged in from {ip_address}'
            )
            
            return session
        except Exception as e:
            print(f"Error creating session: {str(e)}")
            return None
    
    @staticmethod
    def end_session(user):
        """
        End active user session on logout
        """
        try:
            session = UserSession.objects.filter(
                user=user,
                is_active=True
            ).latest('login_time')
            
            session.logout_time = timezone.now()
            session.is_active = False
            session.save()
            
            # Log logout activity
            ActivityTracker.log_activity(
                user=user,
                activity_type='LOGOUT',
                page_or_action='/logout',
                description=f'User logged out. Session duration: {session.session_duration} seconds'
            )
            
            return session
        except UserSession.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error ending session: {str(e)}")
            return None
    
    @staticmethod
    def log_page_view(user, page_url, request=None, duration_seconds=None):
        """
        Log page view activity
        """
        return ActivityTracker.log_activity(
            user=user,
            activity_type='PAGE_VIEW',
            page_or_action=page_url,
            request=request,
            duration_seconds=duration_seconds
        )
    
    @staticmethod
    def log_user_action(user, action_name, request=None, description='', duration_seconds=None):
        """
        Log user action (button click, form submission, etc.)
        """
        return ActivityTracker.log_activity(
            user=user,
            activity_type='ACTION',
            page_or_action=action_name,
            request=request,
            description=description,
            duration_seconds=duration_seconds
        )
    
    @staticmethod
    def log_data_modification(user, resource_type, resource_id, request=None, description=''):
        """
        Log data modification (create, update)
        """
        return ActivityTracker.log_activity(
            user=user,
            activity_type='DATA_MODIFY',
            page_or_action=f'{resource_type}#{resource_id}',
            request=request,
            description=description
        )
    
    @staticmethod
    def log_data_deletion(user, resource_type, resource_id, request=None, description=''):
        """
        Log data deletion
        """
        return ActivityTracker.log_activity(
            user=user,
            activity_type='DATA_DELETE',
            page_or_action=f'{resource_type}#{resource_id}',
            request=request,
            description=description
        )
    
    @staticmethod
    def log_search(user, search_query, search_type, request=None, results_count=0):
        """
        Log search activity
        """
        return ActivityTracker.log_activity(
            user=user,
            activity_type='SEARCH',
            page_or_action=search_type,
            request=request,
            description=f'Search: "{search_query}" - {results_count} results found'
        )
    
    @staticmethod
    def get_user_analytics(user, days=30):
        """
        Get comprehensive analytics for a user
        """
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        
        activities = UserActivity.objects.filter(
            user=user,
            timestamp__gte=cutoff_date
        )
        
        sessions = UserSession.objects.filter(
            user=user,
            login_time__gte=cutoff_date
        )
        
        analytics = {
            'total_activities': activities.count(),
            'activity_breakdown': dict(activities.values_list('activity_type').annotate(
                count=__import__('django.db.models', fromlist=['Count']).Count('id')
            )),
            'total_sessions': sessions.count(),
            'total_login_time': sum((s.session_duration for s in sessions), 0),
            'average_session_duration': sum((s.session_duration for s in sessions), 0) / max(sessions.count(), 1),
            'total_pages_visited': sum((s.pages_visited for s in sessions), 0),
            'total_actions_performed': sum((s.total_actions for s in sessions), 0),
            'most_visited_pages': dict(activities.filter(
                activity_type='PAGE_VIEW'
            ).values_list('page_or_action').annotate(
                count=__import__('django.db.models', fromlist=['Count']).Count('id')
            )),
        }
        
        return analytics


class RoleBasedAccessControl:
    """
    Role-based access control and account creation restrictions
    """
    
    ROLE_PERMISSIONS = {
        'admin': [
            'view_students', 'add_student', 'edit_student', 'delete_student',
            'view_teachers', 'add_teacher', 'edit_teacher', 'delete_teacher',
            'view_attendance', 'mark_attendance',
            'view_analytics', 'manage_accounts', 'approve_accounts',
            'view_eye_scanner', 'register_iris', 'verify_iris',
            'access_settings', 'manage_roles'
        ],
        'teacher': [
            'view_students', 'edit_student', 'view_attendance', 'mark_attendance',
            'view_eye_scanner', 'register_iris', 'verify_iris',
            'access_settings', 'view_own_profile'
        ],
        'student': [
            'view_own_profile', 'view_attendance', 'access_settings',
            'view_eye_scanner', 'register_iris', 'verify_iris'
        ]
    }
    
    @staticmethod
    def has_permission(user, permission):
        """Check if user has specific permission"""
        if not hasattr(user, 'profile'):
            return False
        
        role = user.profile.role
        return permission in RoleBasedAccessControl.ROLE_PERMISSIONS.get(role, [])
    
    @staticmethod
    def can_create_account(creator_user, target_role):
        """
        Determine if user can create accounts of target role
        
        Rules:
        - Only ADMIN can create ADMIN and TEACHER accounts
        - TEACHER can suggest students (but ADMIN must approve)
        - STUDENT cannot create any accounts
        """
        if not hasattr(creator_user, 'profile'):
            return False
        
        creator_role = creator_user.profile.role
        
        if creator_role == 'admin':
            return target_role in ['admin', 'teacher', 'student']
        elif creator_role == 'teacher':
            return target_role == 'student'
        else:  # student
            return False
    
    @staticmethod
    def requires_approval(target_role):
        """
        Check if account creation requires admin approval
        
        STUDENT accounts created by TEACHER require ADMIN approval
        """
        return target_role == 'student'
