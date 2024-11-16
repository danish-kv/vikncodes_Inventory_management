
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from rest_framework_simplejwt.views import  TokenRefreshView
from users.views import RegisterViewSet, CustomTokenObtainPairView, OTPVerifiy

router = DefaultRouter()
router.register(f"register", RegisterViewSet, basename='register')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/otp-verify/', OTPVerifiy.as_view(), name='otp-verify')


]
