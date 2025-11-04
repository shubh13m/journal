from rest_framework import viewsets, permissions, generics
from django.db.models import Q, Prefetch
from .models import Journal
from .serializers import JournalSerializer, UserMiniSerializer
from django.contrib.auth.models import User


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserMiniSerializer
    permission_classes = [permissions.IsAuthenticated]


class JournalViewSet(viewsets.ModelViewSet):
    serializer_class = JournalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        mine = self.request.query_params.get("mine", "").lower() == "true"

        if user.is_authenticated:
            if mine:
                return Journal.objects.filter(author=user)

            # Include SPECIFIC journals shared with this user
            return Journal.objects.filter(
                Q(visibility="PUBLIC") |
                Q(author=user) |
                Q(visibility="SPECIFIC", shared_with=user)
            ).distinct()

        # Not logged in → only public journals
        return Journal.objects.filter(visibility="PUBLIC")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
