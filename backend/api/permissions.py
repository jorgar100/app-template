# Fichero: backend/api/permissions.py
from rest_framework.permissions import BasePermission

class IsRootUser(BasePermission):
    """
    Allows access only to users with the 'ROOT' role.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and if their role is ROOT
        return request.user and request.user.is_authenticated and request.user.role == 'ROOT'