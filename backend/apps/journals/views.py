from rest_framework import viewsets, permissions, generics
from django.db.models import Q
from .models import Journal
from .serializers import JournalSerializer, UserMiniSerializer
from django.contrib.auth.models import User
from apps.followers.models import Follow, is_mutual_follow  # import mutual follow utility


class UserListView(generics.ListAPIView):
    """
    Returns a paginated list of users for picking specific users
    """
    queryset = User.objects.all()
    serializer_class = UserMiniSerializer
    permission_classes = [permissions.IsAuthenticated]


class JournalViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for journals.
    Supports Three-Tier Visibility (PUBLIC, PRIVATE, SPECIFIC) + FRIENDS.
    """
    serializer_class = JournalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        mine = self.request.query_params.get("mine", "").lower() == "true"

        if user.is_authenticated:
            if mine:
                # Only journals authored by the current user
                return Journal.objects.filter(author=user)

            # Base queryset: PUBLIC + author’s own + SPECIFIC shared_with
            base_qs = Journal.objects.filter(
                Q(visibility="PUBLIC") |
                Q(author=user) |
                Q(visibility="SPECIFIC", shared_with=user)
            ).distinct().select_related('author').prefetch_related('shared_with')

            # FRIENDS journals: only if mutual follow
            friends_qs = Journal.objects.filter(visibility="FRIENDS").select_related('author')
            friends_qs = [j for j in friends_qs if is_mutual_follow(j.author, user)]

            # Combine base and friends journals
            return list(base_qs) + friends_qs

        # Not logged in → only public journals
        return Journal.objects.filter(visibility="PUBLIC").select_related('author')

    def perform_create(self, serializer):
        # Automatically set author as current user
        serializer.save(author=self.request.user)
