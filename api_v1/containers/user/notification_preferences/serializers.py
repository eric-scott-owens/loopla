from rest_framework import serializers

class NotificationPreferencesSerializer(serializers.Serializer):
    notify_by_email = serializers.BooleanField()
    notify_by_text = serializers.BooleanField()
