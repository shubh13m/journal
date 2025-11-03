from rest_framework import serializers
from .models import Journal
from django.contrib.auth.models import User


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class JournalSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    shared_with = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Journal
        fields = [
            "id",
            "title",
            "content",
            "visibility",
            "author_name",
            "shared_with",
            "created_at",
        ]

    def create(self, validated_data):
        shared_users = validated_data.pop("shared_with", [])
        journal = Journal.objects.create(**validated_data)
        journal.shared_with.set(shared_users)
        return journal
