from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from .models import Follow
from .serializers import FollowSerializer

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, user_id):
    target = User.objects.filter(id=user_id).first()
    if not target or target == request.user:
        return Response({'error': 'Invalid user.'}, status=400)
    Follow.objects.get_or_create(follower=request.user, following=target)
    return Response({'message': f'You are now following {target.username}.'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unfollow_user(request, user_id):
    Follow.objects.filter(follower=request.user, following_id=user_id).delete()
    return Response({'message': 'Unfollowed successfully.'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def followers_list(request, user_id):
    followers = Follow.objects.filter(following_id=user_id)
    serializer = FollowSerializer(followers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def following_list(request, user_id):
    following = Follow.objects.filter(follower_id=user_id)
    serializer = FollowSerializer(following, many=True)
    return Response(serializer.data)
