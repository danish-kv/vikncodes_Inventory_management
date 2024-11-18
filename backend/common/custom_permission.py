from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Custom permission to allow access only to superusers (admins).
    """
    def has_permission(self, request, view):
        """
        Check if the user is authenticated and is a superuser (admin).
        """
        return request.user.is_authenticated and request.user.is_superuser


class IsUser(BasePermission):
    """
    Custom permission to allow access only to regular users (non-admins).
    """
    def has_permission(self, request, view):
        """
        Check if the user is authenticated and is NOT a superuser (non-admin).
        """
        return request.user.is_authenticated and not request.user.is_superuser
