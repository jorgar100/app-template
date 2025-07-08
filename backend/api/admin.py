#backend/api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin configuration for the CustomUser model.
    This enhances the default user admin panel to display and manage our custom 'role' field.
    """
    # Add our custom fields to the main user list display
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')

    # Add 'role' to the fieldsets to make it editable in the user detail view
    # We copy the original fieldsets and add our role section
    fieldsets = UserAdmin.fieldsets + (
        ('Role Management', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Management', {'fields': ('role',)}),
    )