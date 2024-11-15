from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
import re
from users.models import CustomUser


def validate_email(value):
    try:
        EmailValidator()(value) 
    except ValidationError:
        raise ValidationError("Invalid email format.")
    
    if CustomUser.objects.filter(email=value).exists():
        raise ValidationError("User with this email already exists.")
    return value


def validate_password(value):
    if len(value) < 6:
        raise ValidationError("Password must be at least 6 characters.")
    
    if not re.search(r'\d', value): 
        raise ValidationError("Password must contain at least one number.")
    
    if not re.search(r'[A-Z]', value): 
        raise ValidationError("Password must contain at least one uppercase letter.")
    
    return value
