from rest_framework import serializers

class PrivacyPreferencesSerializer(serializers.Serializer):
    is_share_email = serializers.BooleanField()
    is_share_phone = serializers.BooleanField()
    is_share_address = serializers.BooleanField()
