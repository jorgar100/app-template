# Fichero: backend/api/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

from .models import CustomUser
from .serializers import UserSerializer
from rest_framework import viewsets
from .permissions import IsRootUser

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for token generation that uses our custom serializer.
    This view will be used for the login endpoint.
    """
    serializer_class = MyTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = CustomUser.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsRootUser]
    # permission_classes = [IsAdminOrReadOnly] # Placeholder para el siguiente paso