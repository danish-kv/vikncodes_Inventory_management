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

# Custom user model
CustomUser = get_user_model()

class RegisterViewSet(ModelViewSet):
    """
    A viewset for user registration. Allows users to register by providing their details.
    Excludes superusers from the registration process.
    """
    queryset = CustomUser.objects.all().exclude(is_superuser=True)
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['email', 'username']

    def create(self, request, *args, **kwargs):
        """
        Handle the creation of a new user. Validates the data and performs the registration.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining JWT tokens. Overrides the default serializer with a custom one.
    """
    serializer_class = CustomTokenObtainPairSerializer


class OTPVerifiy(APIView):
    """
    View for verifying OTP during the user registration process.
    Validates the provided OTP against the user's stored OTP.
    """
    def post(self, request):
        """
        Handle OTP verification. Checks if the OTP provided by the user matches the stored OTP.
        If valid, the user is marked as verified.
        """
        email = request.data.get('email')
        otp = request.data.get('otp')

        # Check if email is provided
        if not email or not otp:
            return Response(data='Email and OTP are required', status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve user by email
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(data='User not found', status=status.HTTP_404_NOT_FOUND)
        
        # Check if the OTP is expired or not set
        if not user.otp:
            return Response(data='OTP is expired', status=status.HTTP_400_BAD_REQUEST)
        
        # Verify the OTP
        if user.otp == int(otp):
            user.otp = None  # Clear OTP after successful verification
            user.is_verified = True  # Mark user as verified
            user.save()
            return Response(data='OTP verified successfully', status=status.HTTP_200_OK)
        
        return Response(data='Invalid OTP', status=status.HTTP_400_BAD_REQUEST)
    

class LogoutAPIView(APIView):
    """
    View to handle user logout by blacklisting the refresh token.
    This ensures that the refresh token can no longer be used after logout.
    """
    def post(self, request):
        """
        Handle the logout process by invalidating the refresh token.
        Blacklists the token to ensure it cannot be used again.
        """
        try:
            # Get refresh token from request data
            refresh = request.data.get('refresh')
            if not refresh:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the refresh token
            token = RefreshToken(refresh)
            token.blacklist()  # Marks the token as expired

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError as e:
            # Handle invalid or expired token errors
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Catch any other exceptions and return the error message
            print(e)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
