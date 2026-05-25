from rest_framework.routers import DefaultRouter
from .views import StaffViewSet

router = DefaultRouter()
router.register(r'teachers', StaffViewSet)

urlpatterns = router.urls