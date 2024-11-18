import pyotp
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import CustomUser

def generate_otp():
    """
    Generates a 5-digit OTP using TOTP (Time-based One-Time Password) algorithm.
    
    The OTP is generated using the pyotp library's TOTP class, which generates 
    a secure, time-based OTP. The OTP is truncated to the first 5 digits.

    Returns:
        str: A 5-digit OTP.
    """
    # Generate a random base32 secret key for TOTP
    totp = pyotp.TOTP(pyotp.random_base32())
    # Generate OTP based on the current time
    otp = totp.now()
    # Return the first 5 digits of the OTP
    return otp[:5]


def send_otp_email(email, otp):
    """
    Sends the generated OTP code to the user's email.

    Args:
        email (str): The recipient's email address.
        otp (str): The OTP code to send.
    """
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}'  
    email_from = settings.EMAIL_HOST_USER  # Email address configured in settings
    recipient_list = [email]  # List of recipients (in this case, just one)
    
    # Send the OTP email using Django's send_mail function
    send_mail(subject, message, email_from, recipient_list)


@receiver(post_save, sender=CustomUser)
def generate_and_send_otp(sender, instance, created, **kwargs):
    """
    Signal handler to generate and send OTP when a new CustomUser instance is created.
    
    This function is triggered after a new user is created (on post_save signal). 
    It generates an OTP, saves it to the user instance, and sends the OTP to the 
    user's email address.

    Args:
        sender (model): The model class (CustomUser in this case).
        instance (CustomUser): The user instance that was saved.
        created (bool): A flag that indicates whether the instance was created (True) or updated (False).
    """
    if created:
        # Generate a new OTP for the user
        otp = generate_otp()
        # Save the OTP to the user's model
        instance.otp = otp 
        instance.save()  # Save the instance with the new OTP
        
        # Send the OTP to the user's email
        send_otp_email(instance.email, otp)
