from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal: Jab naya User create hota hai, toh uska UserProfile bhi auto-create ho
    """
    if created:
        UserProfile.objects.create(user=instance, role='student')

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal: User save hote waqt UserProfile bhi save ho
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()
