from rest_framework import serializers

class ChangeMembershipStatusSerializer(serializers.Serializer):
  change_status_type = serializers.ChoiceField(
    choices=
    ['ADMIN_TO_MEMBER',
    'ADMIN_TO_INACTIVE',
    'REMOVE_MEMBER',
    'REMOVE_ADMIN',
    'MEMBER_TO_ADMIN',
    'MEMBER_TO_INACTIVE',
    'INACTIVE_TO_ADMIN',
    'INACTIVE_TO_MEMBER',
    'REMOVE_INACTIVE'])
  loop_id = serializers.IntegerField()
  user_id = serializers.IntegerField()
  should_send_message = serializers.BooleanField()
  message = serializers.CharField(required=False, allow_blank=True)