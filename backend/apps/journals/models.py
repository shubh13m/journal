from django.db import models
from django.contrib.auth.models import User
from apps.followers.models import Follow, is_mutual_follow 


class Journal(models.Model):
    VISIBILITY_CHOICES = [
        ('PUBLIC', 'Public'),
        ('PRIVATE', 'Private'),
        ('SPECIFIC', 'Specific'),
        ('FRIENDS', 'Friends'),  # <-- new option
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default='PUBLIC'
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journals')
    shared_with = models.ManyToManyField(User, related_name='shared_journals', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def is_visible_to(self, user):
        """
        Return True if the given user is allowed to view this journal.
        """
        if self.visibility == 'PUBLIC':
            return True
        if self.visibility == 'PRIVATE':
            return user == self.author
        if self.visibility == 'SPECIFIC':
            return user == self.author or user in self.shared_with.all()
        if self.visibility == 'FRIENDS':
            # author can always see
            if user == self.author:
                return True
            return is_mutual_follow(self.author, user)  # <-- new logic
        return False
