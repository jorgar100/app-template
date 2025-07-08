# Fichero: backend/api/serializers.py
# English comments as requested for code standards.

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser 
from rest_framework import serializers 

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to add extra user data to the token's payload.
    This allows the frontend to receive user information immediately upon login,
    avoiding an extra API call.
    """

    @classmethod
    def get_token(cls, user):
        """
        This method is called to generate the token. We override it to add custom claims.
        'user' is an instance of our CustomUser model.
        """
        # First, get the default token from the parent class
        token = super().get_token(user)

        # --- Add Custom Claims ---
        # Now, we add our own data to the token's payload.
        # The frontend will be able to decode this information.
        token['username'] = user.username
        token['role'] = user.role
        # You can add more fields here if needed, like user.email, user.first_name, etc.

        return token

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    Used for listing users in the admin panel.
    """
    class Meta:
        model = CustomUser
        # Fields to display in the user list.
        # We explicitly exclude the password.
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active']