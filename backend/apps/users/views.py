from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from rest_framework.views import APIView

from .models import UserProfile
from .serializers import UserProfileSerializer, UserProfileUpdateSerializer

User = get_user_model()


# ------------------------------
# Current logged-in user info
# ------------------------------
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


# ------------------------------
# Read-only user profile by username
# ------------------------------
class UserProfileDetailView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        username = self.kwargs.get("username")
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("User not found")


# ------------------------------
# Update current user's profile
# ------------------------------
class UpdateProfileView(APIView):
    """
    Handles PATCH and PUT requests for updating the logged-in user's profile.
    This replaces UpdateAPIView to support singleton endpoint PATCH/PUT
    without requiring a pk parameter in the URL.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "profile": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileUpdateSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "profile": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------------
# DEBUG endpoint: check allowed methods
# ------------------------------
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])
def debug_methods(request):
    return Response({
        "method_received": request.method,
        "headers": dict(request.headers),
    })


@api_view(['PUT'])
def test_put(request):
    return Response({"ok": "PUT reached"})


# optional: quick PATCH test
@api_view(['PATCH'])
def test_patch(request):
    return Response({"ok": "PATCH reached"})
