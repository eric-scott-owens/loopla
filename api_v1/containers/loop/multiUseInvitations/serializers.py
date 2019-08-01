from rest_framework import serializers
from itk_invitations.models import MultiUseInvitation, UnregisteredUser
from api_v1.containers.user.serializers import UserSerializer
from api_v1.serializers import DatabaseItemBaseSerializer

class UnregisteredUserSerializer(DatabaseItemBaseSerializer):
  first_name = serializers.CharField(max_length=UnregisteredUser._meta.get_field('first_name').max_length)
  middle_name = serializers.CharField(max_length=UnregisteredUser._meta.get_field('middle_name').max_length)
  last_name = serializers.CharField(max_length=UnregisteredUser._meta.get_field('last_name').max_length)

class MultiUseInvitationSerializer(DatabaseItemBaseSerializer):
  group = serializers.PrimaryKeyRelatedField(read_only=True)
  key = serializers.CharField()
