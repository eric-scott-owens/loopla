from rest_framework import serializers
from itk_invitations.models import Invitation, UnregisteredUser
from api_v1.containers.user.serializers import UserSerializer
from api_v1.serializers import DatabaseItemBaseSerializer

class UnregisteredUserSerializer(DatabaseItemBaseSerializer):
  first_name = serializers.CharField(max_length=UnregisteredUser._meta.get_field('first_name').max_length)
  middle_name = serializers.CharField(max_length=UnregisteredUser._meta.get_field('middle_name').max_length)
  last_name = serializers.CharField(max_length=UnregisteredUser._meta.get_field('last_name').max_length)

class InvitationSerializer(DatabaseItemBaseSerializer):
  invitation_type = serializers.CharField(max_length=Invitation._meta.get_field('invitation_type').max_length)
  group = serializers.PrimaryKeyRelatedField(read_only=True)
  inviter = serializers.PrimaryKeyRelatedField(read_only=True)
  unregistered_inviter = UnregisteredUserSerializer()
  invitee = UnregisteredUserSerializer()
  confirmed_invitee = serializers.PrimaryKeyRelatedField(read_only=True)
  invitation_message = serializers.CharField()
  sent_timestamp = serializers.DateTimeField()
  read_email_timestamp = serializers.DateTimeField()
  first_visit_timestamp = serializers.DateTimeField()
  response_timestamp = serializers.DateTimeField()
  number_of_visits = serializers.IntegerField()
  is_accepted = serializers.BooleanField()
  is_declined = serializers.BooleanField()
  response_message = serializers.CharField()
  key = serializers.CharField()


