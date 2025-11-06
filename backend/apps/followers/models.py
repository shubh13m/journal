from django.db import models
from django.contrib.auth.models import User

class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
        indexes = [
            models.Index(fields=['follower', 'following']),
        ]

    def __str__(self):
        return f"{self.follower.username} → {self.following.username}"

# Utility function to check mutual follow
def is_mutual_follow(user_a, user_b):
    """
    Returns True if user_a follows user_b AND user_b follows user_a
    """
    return Follow.objects.filter(follower=user_a, following=user_b).exists() and \
           Follow.objects.filter(follower=user_b, following=user_a).exists()

