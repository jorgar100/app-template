# backend/api/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser.
    This model is used throughout the project instead of the default User model.
    It includes a 'role' field to manage user permissions.
    """

    # --- B4: Role Definition ---
    # We define roles as constants within the class for clarity and easy access.
    class Roles(models.TextChoices):
        """Enumeration for user roles."""
        ROOT = 'ROOT', 'Root'
        ADMIN = 'ADMIN', 'Admin'
        CLIENT = 'CLIENT', 'Client'

    # The base role is 'CLIENT' for any new user.
    base_role = Roles.CLIENT

    # --- B3: Custom Fields ---
    # The 'role' field stores the user's role. It uses the choices from the Roles class.
    role = models.CharField(max_length=50, choices=Roles.choices, default=base_role)

    def save(self, *args, **kwargs):
        if not self.pk: # If the object is new
            # If the new user is a superuser, assign them the ROOT role.
            if self.is_superuser:
                self.role = self.Roles.ROOT
            else:
                # Otherwise, assign the base role.
                self.role = self.base_role
        super().save(*args, **kwargs)