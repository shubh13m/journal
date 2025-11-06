# apps/journals/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Journal

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')  # expand later with avatar, display_name

class JournalSerializer(serializers.ModelSerializer):
    shared_with = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False
    )
    author = UserMiniSerializer(read_only=True)

    class Meta:
        model = Journal
        fields = ['id', 'title', 'content', 'author', 'visibility', 'shared_with', 'created_at']
        read_only_fields = ['author', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        shared = validated_data.pop('shared_with', [])
        journal = Journal.objects.create(**validated_data)
        if shared:
            journal.shared_with.set(shared)
        return journal

    def update(self, instance, validated_data):
        shared = validated_data.pop('shared_with', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if shared is not None:
            instance.shared_with.set(shared)
        return instance