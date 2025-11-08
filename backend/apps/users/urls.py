from django.urls import path
from .views import CurrentUserView, UserProfileDetailView, UpdateProfileView, debug_methods, test_put, test_patch

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("profile/update/", UpdateProfileView.as_view(), name="update-profile"),
    path("profile/<str:username>/", UserProfileDetailView.as_view(), name="user-profile"),
    path("debug/", debug_methods, name="debug-methods"),
    path("test-put/", test_put, name="test-put"),
    path("test-patch/", test_patch, name="test-patch"),  # optional test
]
