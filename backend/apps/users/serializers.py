# apps/users/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from apps.followers.models import Follow
from apps.journals.models import Journal
from .models import UserProfile


# --- Journal summary for profile view ---
class JournalSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ["id", "title", "visibility", "created_at"]


# --- Main serializer for profile info ---
class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    # ✅ NEW: include related profile fields (bio + avatar)
    bio = serializers.CharField(source="profile.bio", read_only=True)
    avatar = serializers.ImageField(source="profile.avatar", read_only=True)

    # ✅ NEW: list user’s journals for profile page
    journals = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "followers_count",
            "following_count",
            "bio",
            "avatar",
            "journals",
        ]

    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()

    def get_journals(self, obj):
        journals = Journal.objects.filter(author=obj).order_by("-created_at")
        return JournalSummarySerializer(journals, many=True).data

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'avatar']
