# Generated migration for UserActivity and UserSession models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        # Add is_approved field to UserProfile
        migrations.AddField(
            model_name='userprofile',
            name='is_approved',
            field=models.BooleanField(default=False, help_text='Student accounts must be approved by admin'),
        ),
        
        # Create UserActivity model
        migrations.CreateModel(
            name='UserActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_type', models.CharField(
                    choices=[
                        ('LOGIN', 'Login'),
                        ('LOGOUT', 'Logout'),
                        ('PAGE_VIEW', 'Page View'),
                        ('ACTION', 'Action'),
                        ('DATA_MODIFY', 'Data Modification'),
                        ('DATA_DELETE', 'Data Deletion'),
                        ('SEARCH', 'Search'),
                        ('DOWNLOAD', 'Download'),
                        ('ERROR', 'Error'),
                    ],
                    max_length=20
                )),
                ('page_or_action', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('duration_seconds', models.IntegerField(blank=True, null=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('user_agent', models.TextField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activities', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'User Activities',
                'ordering': ['-timestamp'],
                'indexes': [
                    models.Index(fields=['user', '-timestamp'], name='user_activity_user_time_idx'),
                    models.Index(fields=['activity_type', '-timestamp'], name='user_activity_type_time_idx'),
                ],
            },
        ),
        
        # Create UserSession model
        migrations.CreateModel(
            name='UserSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('login_time', models.DateTimeField(auto_now_add=True)),
                ('logout_time', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('user_agent', models.TextField(blank=True, null=True)),
                ('session_token', models.UUIDField(default=uuid.uuid4, unique=True)),
                ('total_actions', models.IntegerField(default=0)),
                ('pages_visited', models.IntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-login_time'],
                'indexes': [
                    models.Index(fields=['user', '-login_time'], name='user_session_user_login_idx'),
                    models.Index(fields=['is_active'], name='user_session_active_idx'),
                ],
            },
        ),
    ]
