from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status, filters
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from common.base_pagination import CustomPagination
# Create your views here.

CustomUser = get_user_model()

class RegisterViewSet(ModelViewSet):
    queryset = CustomUser.objects.all().exclude(is_superuser=True)
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['email', 'username']  

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class OTPVerifiy(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        print(email,otp)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(data='User not found', status=status.HTTP_404_NOT_FOUND)
        
        if not user.otp:
            return Response(data='OTP is expired', status=status.HTTP_400_BAD_REQUEST)
        
        print('user opt', otp)
        print('og otp', user.otp)
        print(type(user.otp), type(otp))

        if user.otp == int(otp):
            user.otp = None
            user.is_verified = True
            user.save()
            return Response(data='OTP verified successfully', status=status.HTTP_200_OK)
        return Response(data='Invalid OTP', status=status.HTTP_400_BAD_REQUEST)
    

class LogoutAPIView(APIView):
    def post(self, request):
        try:
            refresh = request.data.get('refresh')
            if not refresh:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh)
            token.blacklist()

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError as e:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST) 