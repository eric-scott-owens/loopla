from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer, CreationDateTrackedSerializer
import itk_invitations.models as invitation_models

class UnregisteredUserSerializer(DatabaseItemBaseSerializer, CreationDateTrackedSerializer):
  first_name = serializers.CharField(max_length=invitation_models.UnregisteredUser._meta.get_field('first_name').max_length)
  middle_name = serializers.CharField(max_length=invitation_models.UnregisteredUser._meta.get_field('middle_name').max_length, required=False)
  last_name = serializers.CharField(max_length=invitation_models.UnregisteredUser._meta.get_field('last_name').max_length)
  email = serializers.EmailField()
  phone_number = serializers.CharField(required=False)

class InvitationMessageSerializer(DatabaseItemBaseSerializer, CreationDateTrackedSerializer):
  subject = serializers.CharField(max_length=invitation_models.InvitationMessage._meta.get_field('subject').max_length, required=False)
  message = serializers.CharField(required=False)

class InvitationSerializer(DatabaseItemBaseSerializer, CreationDateTrackedSerializer):
  invitation_message = InvitationMessageSerializer(required=False)
  sent_timestamp = serializers.DateTimeField(required=False)
  read_email_timestamp = serializers.DateTimeField(required=False)
  first_visit_timestamp = serializers.DateTimeField(required=False)
  response_timestamp = serializers.DateTimeField(required=False)
  number_of_visits = serializers.IntegerField(required=False)
  is_accepted = serializers.BooleanField(required=False)
  is_declined = serializers.BooleanField(required=False)
  response_message = serializers.CharField(required=False)