from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.utils.timezone import now
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .signals import send_otp_email, generate_otp
from common.validations import validate_email, validate_password

# Get the custom user model
CustomUser = get_user_model()

class UserSerializer(ModelSerializer):
    """
    Serializer for creating and updating users.
    Validates email and password, and ensures that email is unique.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'profile', 'last_login', 'is_active', 'is_verified']

    def validate_email(self, value):
        """
        Validate email format.
        """
        return validate_email(value)

    def validate_password(self, value):
        """
        Validate password format.
        """
        return validate_password(value)

    def create(self, validated_data):
        """
        Create a new user. Check if the email already exists.
        """
        email = validated_data.get('email')
        
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError({'email': 'User with this email already exists'})
        
        user = CustomUser.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to get JWT tokens with extra user info (like profile, role).
    Handles OTP sending if the user's account is not verified.
    """
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    @classmethod
    def get_token(cls, user: CustomUser):
        """
        Generate a JWT token with user-specific claims like profile and role.
        """
        token = super().get_token(user)
        user.last_login = now()
        user.save()

        # Add user-specific information to the token
        if user.is_superuser:
            token['is_admin'] = True
            token['role'] = 'admin'
        else:
            token['user'] = user.username
            token['id'] = user.id
            token['profile'] = user.profile.url if user.profile else None
            token['is_active'] = user.is_active
            token['email'] = user.email
            token['is_verified'] = user.is_verified
            token['role'] = 'user'

        return token

    def validate(self, attrs):
        """
        Validate the login credentials and handle OTP if the account is unverified.
        """
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            # Find the user by email
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({
                'error': 'No account found with the given email.'
            }, code='no_account')

        # Check if the account is active
        if not user.is_active:
            raise serializers.ValidationError({
                'error': 'Your account has been blocked by the admin.'
            }, code='blocked')

        # Verify password
        if not user.check_password(password):
            raise serializers.ValidationError({
                'error': 'Invalid credentials'
            }, code='authentication')

        # If the account is unverified, send an OTP
        if not user.is_verified and not user.is_superuser:
            otp = generate_otp()
            user.otp = otp
            user.save()
            send_otp_email(user.email, otp)
            raise serializers.ValidationError({
                'error': 'Account not verified. An OTP has been sent to your email.',
                'require_verification': True
            }, code='unverified')

        self.user = user
        # Get the validated token data
        data = super().validate(attrs)

        # Add the access and refresh tokens to the response
        data.update({
            'access_token': data.pop('access'),
            'refresh_token': data.pop('refresh'),
            'user': user.username,
            'role': 'admin' if user.is_superuser else 'user'
        })

        return data
