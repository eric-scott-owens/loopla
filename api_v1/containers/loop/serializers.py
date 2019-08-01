import uuid
import django.contrib.auth.models as auth_models
from django.utils.crypto import get_random_string
from rest_framework import serializers

from api_v1.serializers import ModelTrackedSerializer
import groups.models as group_models
from itk_invitations.models import MultiUseInvitation
import users.models as user_models

def generate_safe_group_name(nameStr):
  name_segment = nameStr
  if len(name_segment) > 42: 
    # The name, plus our additions below, need to come out to no more than 80 chars for the database
    name_segment = name_segment[:42]

  return name_segment + '__' + str(uuid.uuid4())

class CircleSerializer(serializers.Serializer):
  name = serializers.CharField(max_length=group_models.Circle._meta.get_field('name').max_length)
  city = serializers.CharField(max_length=80, required=False, allow_blank=True)
  state = serializers.CharField(max_length=2, required=False, allow_blank=True)
  description = serializers.CharField(required=False, allow_blank=True)
  guidelines = serializers.CharField(required=False, allow_blank=True)
  date_created = serializers.DateField(read_only=True)
  user_references = serializers.SerializerMethodField()
  user_count = serializers.IntegerField(read_only=True)
  
  def get_user_references(self, obj):
    user_references = obj.get_user_references()
    return user_references

class GroupSerializer(ModelTrackedSerializer):
  id = serializers.IntegerField(min_value=0,read_only=True)
  name = serializers.CharField(read_only=True, max_length=group_models.Group._meta.get_field('name').max_length)
  circle = CircleSerializer()
  founder_id = serializers.IntegerField(min_value=0,write_only=True)

  def create(self, validated_data):
    try: 
      safe_name = generate_safe_group_name(validated_data['circle']['name'])
      new_loop = auth_models.Group.objects.create(name=safe_name)
      new_loop.save()

      # Patch in any circle data
      new_circle = group_models.Circle(group=new_loop)
      if 'circle' in validated_data:
        validated_circle_data = validated_data['circle']
        if 'name' in validated_circle_data:
          new_circle.name = validated_circle_data['name']
        if 'description' in validated_circle_data:
          new_circle.description = validated_circle_data['description']
        if 'city' in validated_circle_data:
          new_circle.city = validated_circle_data['city']
        if 'state' in validated_circle_data:
          new_circle.state = validated_circle_data['state']
        if 'guidelines' in validated_circle_data:
          new_circle.guidelines = validated_circle_data['guidelines']
        
        new_circle.save()

      # Add the user who created the loop as the founding member
      current_user = auth_models.User.objects.get(pk=validated_data['founder_id'])
      new_loop.user_set.add(current_user)
      user_models.Membership.objects.create(
        user = current_user,
        group = new_loop,
        is_coordinator = True,
        is_founder = True,
        is_active = True,
        user_engagement_section_dismissed = False
      )

      stored_loop = auth_models.Group.objects.get(pk=new_loop.id)

      # Add entry to multi_use_invitation table
      multi_use_invitation = MultiUseInvitation(key=get_random_string(64).lower(), group=stored_loop)
      multi_use_invitation.save()

      return stored_loop
    except Exception as e:
      raise e

  def update(self, instance, validated_data):
    try:
      need_to_save_group = False

      if 'circle' in validated_data:
        need_to_save_circle = False
        circle_instance = group_models.Circle.objects.get(pk=instance.circle.id)
        validated_circle_data = validated_data.get('circle', circle_instance)
        
        if 'name' in validated_circle_data:
          circle_instance.name = validated_circle_data['name']
          need_to_save_circle = True

          instance.name = generate_safe_group_name(validated_circle_data['name'])
          need_to_save_group = True

        if 'description' in validated_circle_data:
          circle_instance.description = validated_circle_data.get('description', circle_instance.description)
          need_to_save_circle = True

        if 'guidelines' in validated_circle_data:
          circle_instance.guidelines = validated_circle_data.get('guidelines', circle_instance.guidelines)
          need_to_save_circle = True

        if 'city' in validated_circle_data:
          circle_instance.city = validated_circle_data.get('city', circle_instance.city)
          need_to_save_circle = True

        if 'state' in validated_circle_data:
          circle_instance.state = validated_circle_data.get('state', circle_instance.state)
          need_to_save_circle = True

        if need_to_save_circle:
          circle_instance.save()

      if need_to_save_group:
        instance.save()

      updated_instance = auth_models.Group.objects.get(pk=instance.id)
      return updated_instance
    except Exception as e:
      raise e