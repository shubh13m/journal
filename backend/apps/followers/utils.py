from .models import Follow

def is_mutual_follow(user_a, user_b):
    """Return True if both users follow each other."""
    if not user_a or not user_b:
        return False
    return (
        Follow.objects.filter(follower=user_a, following=user_b).exists() and
        Follow.objects.filter(follower=user_b, following=user_a).exists()
    )
