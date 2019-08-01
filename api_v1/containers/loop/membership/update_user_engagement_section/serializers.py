from rest_framework import serializers

class UpdateUserEngagementSectionSerializer(serializers.Serializer):
  group_id = serializers.IntegerField()
  user_id = serializers.IntegerField()
  user_engagement_section_dismissed = serializers.BooleanField()