from landing_page.models import KeepInContact
from rest_framework import serializers
from itk_invitations.models import UnregisteredUser
from api_v1.serializers import DatabaseItemBaseSerializer

class UnregisteredUserSerializer(DatabaseItemBaseSerializer):
  first_name = serializers.CharField(max_length=30, required=False)
  last_name = serializers.CharField(max_length=30, required=False)
  email = serializers.EmailField()

  def create(self, validated_data):
    return UnregisteredUser(**validated_data)

class KeepInContactSerializer(DatabaseItemBaseSerializer):
  contact_info = UnregisteredUserSerializer()
  general_comments = serializers.CharField(required=False, allow_blank=True)
  
  def create(self, validated_data):
    try:
      new_waitlist = KeepInContact(validated_data)
      contact_info = UnregisteredUserSerializer()
      validated_contact_data = validated_data['contact_info']
      my_contact_info = contact_info.create(validated_contact_data)
      my_contact_info.save()

      new_waitlist.general_comments = validated_data['general_comments']

      new_waitlist.contact_info_id = my_contact_info.id

      new_waitlist.id = None
      new_waitlist.save()

      return new_waitlist
    except Exception as e:
      raise e