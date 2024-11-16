
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter 
from rest_framework_simplejwt.views import  TokenRefreshView
from users.views import RegisterViewSet, CustomTokenObtainPairView, OTPVerifiy
from products.views import ProductViewSet, CategoryViewSet, SubVariantViewSet, VariantViewSet


router = DefaultRouter()
router.register(f"register", RegisterViewSet, basename='register')
router.register(f"product", ProductViewSet, basename='product')
router.register(f"category", CategoryViewSet, basename='category')
router.register(f"variant", VariantViewSet, basename='variant')
router.register(f"sub-variant", SubVariantViewSet, basename='sub-variant')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/otp-verify/', OTPVerifiy.as_view(), name='otp-verify')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_ROOT, document_root=settings.STATIC_ROOT)
