from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer, CreationDateTrackedSerializer

class MembershipSerializer(DatabaseItemBaseSerializer):
  user = serializers.PrimaryKeyRelatedField(read_only=True)
  user_id = serializers.IntegerField(required=False, write_only=True)

  group = serializers.PrimaryKeyRelatedField(read_only=True)
  group_id = serializers.IntegerField(required=False, write_only=True)

  date_joined = serializers.DateField(required=False)
  date_became_inactive = serializers.DateField(required=False)
  date_became_coordinator = serializers.DateField(required=False)

  is_coordinator = serializers.BooleanField(required=False)
  is_founder = serializers.BooleanField(required=False, read_only=True)
  is_active = serializers.BooleanField(required=False)
  user_engagement_section_dismissed = serializers.BooleanField(required=False)  
  date_first_posted = serializers.DateTimeField(required=False)