from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import JournalViewSet, UserListView

router = DefaultRouter()
router.register(r'journals', JournalViewSet, basename='journal')

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


