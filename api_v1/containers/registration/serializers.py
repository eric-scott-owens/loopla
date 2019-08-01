from django.contrib.auth.models import User
from users.models import Person
from rest_framework import serializers

class IsEmailRegisteredSerializer(serializers.Serializer):
  email = serializers.EmailField()

class IsUsernameRegisteredSerializer(serializers.Serializer):
  username = serializers.CharField(max_length=User._meta.get_field('username').max_length)

class ValidateNewPasswordSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=4096)

class RegistrationRequestSerializer(
  IsEmailRegisteredSerializer, 
  IsUsernameRegisteredSerializer, 
  ValidateNewPasswordSerializer):
  
  first_name = serializers.CharField(max_length=User._meta.get_field('first_name').max_length)
  middle_name = serializers.CharField(max_length=Person._meta.get_field('middle_name').max_length, required=False, allow_blank=True)
  last_name = serializers.CharField(max_length=User._meta.get_field('last_name').max_length)
  telephone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  send_text_notifications = serializers.BooleanField()
  