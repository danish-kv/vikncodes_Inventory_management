from django.db import models
from django.contrib.auth.models import AbstractUser




class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, null=True)
    profile = models.ImageField(upload_to='profile/', null=True, blank=True)
    email = models.EmailField(unique=True)
    otp = models.IntegerField(null=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.email
    
