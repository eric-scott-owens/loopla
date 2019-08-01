from rest_framework import serializers
from api_v1.containers.loop.membership.invitations.serializers import UnregisteredUserSerializer

class AddLoopAdministratorSerializer(serializers.Serializer):
  message = serializers.CharField(required=False, allow_blank=True)
  invitee = UnregisteredUserSerializer()
  loop_id = serializers.IntegerField(required=True)