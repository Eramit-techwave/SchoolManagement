from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .serializers import MyTokenObtainPairSerializer
from .models import UserProfile, UserActivity, UserSession
from .tracking import ActivityTracker, RoleBasedAccessControl


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Enhanced login endpoint with activity tracking
    """
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # 1. Standard login (tokens generate honge)
        response = super().post(request, *args, **kwargs)
        
        # 2. User ka role manual response mein dalo
        try:
            username = request.data.get('username')
            user = User.objects.get(username=username)
            
            # Check if account is approved (for students)
            if hasattr(user, 'profile'):
                if user.profile.role == 'student' and not user.profile.is_approved:
                    return Response({
                        'error': 'Your account is pending admin approval. Please contact administrator.'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                response.data['role'] = user.profile.role
            else:
                # If profile doesn't exist, create it and default to student
                profile = UserProfile.objects.create(user=user, role='student', is_approved=True)
                response.data['role'] = profile.role
            
            response.data['username'] = user.username
            
            # LOG LOGIN ACTIVITY
            ActivityTracker.create_session(user, request)
            
        except User.DoesNotExist:
            response.data['role'] = 'student'
            response.data['username'] = request.data.get('username', 'unknown')
        except Exception as e:
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
        # Log page view
        ActivityTracker.log_page_view(user, '/api/users/profile', request)
        
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
        
        # Log action
        ActivityTracker.log_user_action(
            user, 
            'PROFILE_UPDATE',
            request,
            description='User updated profile information'
        )
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.profile.role if hasattr(user, 'profile') else 'student',
            'message': 'Profile updated successfully!'
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout endpoint - ends user session and logs activity
    """
    user = request.user
    ActivityTracker.end_session(user)
    
    return Response({
        'message': 'Logged out successfully',
        'username': user.username
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_analytics_dashboard(request):
    """
    Admin analytics dashboard - all user activities and sessions
    """
    # Get query parameters
    days = int(request.query_params.get('days', 7))
    cutoff_date = timezone.now() - timedelta(days=days)
    
    # Overall statistics
    total_users = User.objects.count()
    admin_users = UserProfile.objects.filter(role='admin').count()
    teacher_users = UserProfile.objects.filter(role='teacher').count()
    student_users = UserProfile.objects.filter(role='student').count()
    pending_students = UserProfile.objects.filter(role='student', is_approved=False).count()
    
    # Session statistics
    total_sessions = UserSession.objects.filter(login_time__gte=cutoff_date).count()
    active_sessions = UserSession.objects.filter(is_active=True).count()
    
    # Activity statistics
    total_activities = UserActivity.objects.filter(timestamp__gte=cutoff_date).count()
    
    # Activity breakdown
    activity_breakdown = dict(
        UserActivity.objects.filter(timestamp__gte=cutoff_date)
        .values('activity_type')
        .annotate(count=Count('id'))
        .values_list('activity_type', 'count')
    )
    
    # Most active users
    most_active_users = UserActivity.objects.filter(
        timestamp__gte=cutoff_date
    ).values(
        'user__username', 'user__profile__role'
    ).annotate(
        activity_count=Count('id')
    ).order_by('-activity_count')[:10]
    
    # Login statistics
    logins_last_24h = UserActivity.objects.filter(
        activity_type='LOGIN',
        timestamp__gte=timezone.now() - timedelta(hours=24)
    ).count()
    
    logins_last_7d = UserActivity.objects.filter(
        activity_type='LOGIN',
        timestamp__gte=timezone.now() - timedelta(days=7)
    ).count()
    
    return Response({
        'report_period': f'Last {days} days',
        'generated_at': timezone.now().isoformat(),
        'user_statistics': {
            'total_users': total_users,
            'admins': admin_users,
            'teachers': teacher_users,
            'students': student_users,
            'pending_approvals': pending_students
        },
        'session_statistics': {
            'total_sessions': total_sessions,
            'active_sessions': active_sessions,
            'average_session_duration': calculate_avg_session_duration(cutoff_date)
        },
        'activity_statistics': {
            'total_activities': total_activities,
            'activity_breakdown': activity_breakdown,
            'logins_24h': logins_last_24h,
            'logins_7d': logins_last_7d
        },
        'most_active_users': list(most_active_users),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_analytics(request, user_id):
    """
    Detailed analytics for specific user
    """
    try:
        user = User.objects.get(id=user_id)
        days = int(request.query_params.get('days', 30))
        
        analytics = ActivityTracker.get_user_analytics(user, days)
        
        # Get recent activities
        recent_activities = UserActivity.objects.filter(user=user).order_by('-timestamp')[:20]
        
        activity_data = []
        for activity in recent_activities:
            activity_data.append({
                'type': activity.activity_type,
                'page_or_action': activity.page_or_action,
                'timestamp': activity.timestamp.isoformat(),
                'duration': activity.duration_seconds,
                'ip_address': activity.ip_address
            })
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.profile.role if hasattr(user, 'profile') else 'student'
            },
            'analytics': analytics,
            'recent_activities': activity_data
        }, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_account_approvals(request):
    """
    Get list of pending student account approvals
    """
    pending_students = UserProfile.objects.filter(
        role='student',
        is_approved=False
    ).select_related('user')
    
    students_data = []
    for profile in pending_students:
        students_data.append({
            'id': profile.user.id,
            'username': profile.user.username,
            'email': profile.user.email,
            'first_name': profile.user.first_name,
            'last_name': profile.user.last_name,
            'created_date': profile.user.date_joined.isoformat()
        })
    
    return Response({
        'pending_approvals': len(students_data),
        'students': students_data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_student_account(request, user_id):
    """
    Admin approves student account
    """
    try:
        user = User.objects.get(id=user_id)
        profile = user.profile
        
        if profile.role != 'student':
            return Response({
                'error': 'Only student accounts can be approved'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        profile.is_approved = True
        profile.save()
        
        # Log action
        ActivityTracker.log_user_action(
            request.user,
            'STUDENT_APPROVED',
            request,
            description=f'Admin approved student account: {user.username}'
        )
        
        return Response({
            'message': f'Student {user.username} approved successfully',
            'student': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_approved': profile.is_approved
            }
        }, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_student_account(request, user_id):
    """
    Admin rejects student account
    """
    try:
        user = User.objects.get(id=user_id)
        profile = user.profile
        
        if profile.role != 'student':
            return Response({
                'error': 'Only student accounts can be rejected'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        profile.is_approved = False
        profile.save()
        
        # Log action
        ActivityTracker.log_user_action(
            request.user,
            'STUDENT_REJECTED',
            request,
            description=f'Admin rejected student account: {user.username}'
        )
        
        return Response({
            'message': f'Student {user.username} rejected',
            'student': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_approved': profile.is_approved
            }
        }, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


def calculate_avg_session_duration(cutoff_date):
    """
    Calculate average session duration for given date range
    """
    sessions = UserSession.objects.filter(login_time__gte=cutoff_date)
    if not sessions.exists():
        return 0
    
    total_duration = sum(s.session_duration for s in sessions)
    return total_duration / sessions.count()