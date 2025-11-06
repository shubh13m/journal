from django.urls import path
from . import views

urlpatterns = [
    path('<int:user_id>/follow/', views.follow_user, name='follow-user'),
    path('<int:user_id>/unfollow/', views.unfollow_user, name='unfollow-user'),
    path('<int:user_id>/followers/', views.followers_list, name='followers-list'),
    path('<int:user_id>/following/', views.following_list, name='following-list'),
    path('<int:user_id>/status/', views.follow_status, name='follow_status'),  # 👈 NEW
]
