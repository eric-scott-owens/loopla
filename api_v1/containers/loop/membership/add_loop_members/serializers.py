from rest_framework import serializers
from api_v1.containers.loop.membership.invitations.serializers import UnregisteredUserSerializer

class AddLoopMembersSerializer(serializers.Serializer):
  message = serializers.CharField(required=False, allow_blank=True)
  invitees = UnregisteredUserSerializer(many=True)
  loop_id = serializers.IntegerField(required=True)
