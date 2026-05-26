from django.urls import path
from .views import (
    user_profile, 
    logout_view, 
    admin_analytics_dashboard,
    user_analytics,
    pending_account_approvals,
    approve_student_account,
    reject_student_account
)

urlpatterns = [
    # User endpoints
    path('profile/', user_profile, name='user_profile'),
    path('logout/', logout_view, name='logout'),
    
    # Admin analytics and management
    path('admin/analytics/', admin_analytics_dashboard, name='admin_analytics'),
    path('admin/analytics/user/<int:user_id>/', user_analytics, name='user_analytics'),
    path('admin/pending-approvals/', pending_account_approvals, name='pending_approvals'),
    path('admin/approve/<int:user_id>/', approve_student_account, name='approve_student'),
    path('admin/reject/<int:user_id>/', reject_student_account, name='reject_student'),
]
