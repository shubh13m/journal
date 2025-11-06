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

    # ✅ Calculate counts dynamically
    followers_count = Follow.objects.filter(following=target).count()
    following_count = Follow.objects.filter(follower=request.user).count()

    return Response({
        'message': f'You are now following {target.username}.',
        'followers_count': followers_count,
        'following_count': following_count
    })

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

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def follow_status(request, user_id):
    """
    Returns relationship status between the logged-in user and the target user.
    Possible states: not_following, following, follow_back, mutual
    """
    from django.shortcuts import get_object_or_404
    target = get_object_or_404(User, id=user_id)
    user = request.user

    if target == user:
        return Response({'status': 'self'})  # optional; useful for debugging

    user_follows_target = Follow.objects.filter(follower=user, following=target).exists()
    target_follows_user = Follow.objects.filter(follower=target, following=user).exists()

    if user_follows_target and target_follows_user:
        status = "mutual"
    elif user_follows_target:
        status = "following"
    elif target_follows_user:
        status = "follow_back"
    else:
        status = "not_following"

    return Response({'status': status})
