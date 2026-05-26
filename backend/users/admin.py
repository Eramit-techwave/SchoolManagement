from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Sum, Count, Q
from datetime import timedelta
from django.utils import timezone

from .models import UserProfile, UserActivity, UserSession

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['username', 'role', 'is_approved', 'email', 'last_login']
    list_filter = ['role', 'is_approved', 'user__date_joined']
    search_fields = ['user__username', 'user__email']
    actions = ['approve_users', 'reject_users']
    
    def username(self, obj):
        return obj.user.username
    
    def email(self, obj):
        return obj.user.email
    
    def last_login(self, obj):
        if obj.user.last_login:
            return obj.user.last_login.strftime('%Y-%m-%d %H:%M:%S')
        return 'Never'
    
    def approve_users(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, "Selected users approved successfully.")
    
    def reject_users(self, request, queryset):
        queryset.update(is_approved=False)
        self.message_user(request, "Selected users rejected.")
    
    approve_users.short_description = "✓ Approve selected student accounts"
    reject_users.short_description = "✕ Reject selected student accounts"


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['username', 'login_time_formatted', 'logout_time_formatted', 
                    'duration_formatted', 'actions_count', 'pages_count', 'is_active_badge']
    list_filter = ['is_active', 'login_time']
    search_fields = ['user__username', 'ip_address']
    readonly_fields = ['login_time', 'logout_time', 'session_token', 'session_duration', 
                       'activity_summary']
    
    def username(self, obj):
        return f"{obj.user.username} ({obj.user.profile.role})"
    
    def login_time_formatted(self, obj):
        return obj.login_time.strftime('%Y-%m-%d %H:%M:%S')
    login_time_formatted.short_description = 'Login Time'
    
    def logout_time_formatted(self, obj):
        if obj.logout_time:
            return obj.logout_time.strftime('%Y-%m-%d %H:%M:%S')
        return format_html('<span style="color: green;"><b>ACTIVE</b></span>')
    logout_time_formatted.short_description = 'Logout Time'
    
    def duration_formatted(self, obj):
        duration = obj.session_duration
        hours = int(duration // 3600)
        minutes = int((duration % 3600) // 60)
        seconds = int(duration % 60)
        return f"{hours}h {minutes}m {seconds}s"
    duration_formatted.short_description = 'Session Duration'
    
    def actions_count(self, obj):
        return f"{obj.total_actions} actions"
    actions_count.short_description = 'Total Actions'
    
    def pages_count(self, obj):
        return f"{obj.pages_visited} pages"
    pages_count.short_description = 'Pages Visited'
    
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">🟢 ACTIVE</span>')
        return format_html('<span style="color: red;">🔴 INACTIVE</span>')
    is_active_badge.short_description = 'Status'
    
    def activity_summary(self, obj):
        activities = UserActivity.objects.filter(
            user=obj.user,
            timestamp__gte=obj.login_time,
            timestamp__lte=obj.logout_time or timezone.now()
        )
        activity_types = activities.values('activity_type').annotate(count=Count('id'))
        
        summary = "<h3>Activity Summary</h3><ul>"
        for act in activity_types:
            summary += f"<li>{act['activity_type']}: {act['count']}</li>"
        summary += "</ul>"
        return format_html(summary)


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['username', 'activity_type_badge', 'page_action', 'timestamp_formatted', 
                    'duration_display', 'ip_address']
    list_filter = ['activity_type', 'timestamp', 'user__profile__role']
    search_fields = ['user__username', 'page_or_action', 'ip_address']
    readonly_fields = ['timestamp', 'user', 'activity_type', 'page_or_action', 'description',
                       'ip_address', 'user_agent', 'duration_seconds', 'detailed_info']
    date_hierarchy = 'timestamp'
    
    def username(self, obj):
        return f"{obj.user.username} ({obj.user.profile.role})"
    
    def activity_type_badge(self, obj):
        color_map = {
            'LOGIN': 'green', 'LOGOUT': 'orange', 'PAGE_VIEW': 'blue',
            'ACTION': 'cyan', 'DATA_MODIFY': 'purple', 'DATA_DELETE': 'red',
            'SEARCH': 'lightblue', 'DOWNLOAD': 'brown', 'ERROR': 'darkred'
        }
        color = color_map.get(obj.activity_type, 'gray')
        return format_html(f'<span style="color: {color}; font-weight: bold;">{obj.activity_type}</span>')
    activity_type_badge.short_description = 'Activity Type'
    
    def page_action(self, obj):
        return obj.page_or_action[:50] + '...' if len(obj.page_or_action) > 50 else obj.page_or_action
    page_action.short_description = 'Page/Action'
    
    def timestamp_formatted(self, obj):
        return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    timestamp_formatted.short_description = 'Timestamp'
    
    def duration_display(self, obj):
        if obj.duration_seconds:
            if obj.duration_seconds < 60:
                return f"{obj.duration_seconds}s"
            elif obj.duration_seconds < 3600:
                minutes = obj.duration_seconds // 60
                seconds = obj.duration_seconds % 60
                return f"{int(minutes)}m {int(seconds)}s"
            else:
                hours = obj.duration_seconds // 3600
                minutes = (obj.duration_seconds % 3600) // 60
                return f"{int(hours)}h {int(minutes)}m"
        return "—"
    duration_display.short_description = 'Duration'
    
    def detailed_info(self, obj):
        info = f"""
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h4>Detailed Information</h4>
            <p><strong>User:</strong> {obj.user.username} ({obj.user.profile.role})</p>
            <p><strong>Activity:</strong> {obj.activity_type}</p>
            <p><strong>Page/Action:</strong> {obj.page_or_action}</p>
            <p><strong>Timestamp:</strong> {obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p><strong>IP Address:</strong> {obj.ip_address or 'N/A'}</p>
            <p><strong>Duration:</strong> {obj.duration_seconds or 'N/A'} seconds</p>
            <p><strong>Description:</strong> {obj.description or 'No description'}</p>
            <details>
                <summary>User Agent</summary>
                <p style="background: white; padding: 10px; border-radius: 3px;">{obj.user_agent or 'N/A'}</p>
            </details>
        </div>
        """
        return format_html(info)
    detailed_info.short_description = 'Detailed Information'