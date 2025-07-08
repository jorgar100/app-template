# Fichero: backend/api/backends.py

from django.contrib.auth.backends import BaseBackend
from .models import CustomUser

class ExternalAuthBackend(BaseBackend):
    """
    Custom authentication backend.
    
    If the user does not exist locally, it creates them upon first login attempt.
    In a real scenario, this is where the call to the external authentication
    service would happen.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # --- SIMULATION OF EXTERNAL AUTHENTICATION ---
        # In a real-world application, you would replace this block
        # with the call to your external Python module.
        # For our template, we will simulate a "successful" authentication
        # for any user that doesn't exist yet, or for existing users
        # if we just check they exist.
        
        # TODO: Replace this block with your actual external authentication logic.
        # Example:
        # if not external_auth_module.validate(username, password):
        #     return None # Authentication fails, return None
        
        # --- USER CREATION LOGIC ---
        try:
            # Try to find the user in our local database.
            user = CustomUser.objects.get(username=username)
            # If found, we can optionally re-check the password or just trust they exist.
            # For our case, we just return the user, assuming the external auth passed.
            return user 
        except CustomUser.DoesNotExist:
            # If the user does not exist, create a new user object.
            # The 'role' will be set to the default 'CLIENT' by the model's save() method.
            user = CustomUser(username=username)
            # We DON'T set a password, as authentication is external.
            # The `set_unusable_password` marks the user as having no local password.
            user.set_unusable_password() 
            user.save()
            return user
    
    def get_user(self, user_id):
        """
        Required method for an authentication backend.
        Gets a user instance from a user ID.
        """
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None