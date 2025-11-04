from django.db import models
from django.contrib.auth.models import User

class Journal(models.Model):
    VISIBILITY_CHOICES = [
        ('PRIVATE', 'Private'),
        ('PUBLIC', 'Public'),
        ('SPECIFIC', 'Specific'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default='PRIVATE'
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journals')
    shared_with = models.ManyToManyField(User, related_name='shared_journals', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


