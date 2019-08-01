from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers
from users.models import Membership, Person, PrivacyPreferences, NotificationPreferences, SummaryPreferences
from api_v1.serializers import ModelTrackedSerializer
from api_v1.containers.user.summary_preferences.serializers import SummaryPreferencesSerializer
from api_v1.containers.user.notification_preferences.serializers import NotificationPreferencesSerializer
from api_v1.containers.user.privacy_preferences.serializers import PrivacyPreferencesSerializer
from api_v1.containers.user.tours_taken.serializers import ToursTakenSerializer

class PersonSerializer(serializers.Serializer):
  middle_name = serializers.CharField(max_length=Person._meta.get_field('middle_name').max_length, required=False, allow_blank=True)
  photo = serializers.ImageField(required=False)
  telephone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  address_line_1  = serializers.CharField(max_length=Person._meta.get_field('address_line_1').max_length, required=False, allow_blank=True)
  address_line_2  = serializers.CharField(max_length=Person._meta.get_field('address_line_2').max_length, required=False, allow_blank=True)
  address_line_3  = serializers.CharField(max_length=Person._meta.get_field('address_line_3').max_length, required=False, allow_blank=True)
  city = serializers.CharField(required=False, allow_blank=True)
  state = serializers.CharField(max_length=2, required=False, allow_blank=True)
  zipcode = serializers.CharField(required=False, allow_blank=True)
  biography = serializers.CharField(max_length=Person._meta.get_field('biography').max_length, required=False, allow_blank=True, allow_null=True)
  can_create_loops = serializers.BooleanField(read_only=True)

class UserSerializer(ModelTrackedSerializer):
  id = serializers.IntegerField()
  username = serializers.CharField(max_length=User._meta.get_field('username').max_length, required=False)
  first_name = serializers.CharField(max_length=User._meta.get_field('first_name').max_length, required=False)
  last_name = serializers.CharField(max_length=User._meta.get_field('last_name').max_length, required=False)
  group_ids = serializers.PrimaryKeyRelatedField(many=True, source="groups", read_only=True)
  person = PersonSerializer(required=False)
  date_modified = serializers.DateTimeField(required=False)
  date_joined = serializers.DateTimeField(required=False)
  email = serializers.EmailField()
  privacy_preferences = PrivacyPreferencesSerializer(required=False)
  notification_preferences = NotificationPreferencesSerializer(required=False)
  tours_taken = ToursTakenSerializer(read_only=True)
  newest_update = serializers.SerializerMethodField(required=False)
  
  def get_newest_update(self, obj):
    return obj.person.newest_update

  @staticmethod
  def security_trim_and_eager_load(queryset, request):
    # Security trim to only groups the user is in
    user = request.user
    groups = user.groups.all()
    queryset = queryset.filter(membership__group__in=groups).distinct()

    # Security trim members added to the groups since this user
    # was made inactive in any group(s)
    inactive_memberships = Membership.objects.filter(user__id=user.id,is_active=False)
    for membership in inactive_memberships:
      queryset = queryset.exclude(
        Q(groups__id=membership.group_id) 
        & Q(membership__date_joined__gt=membership.date_became_inactive)
      )
    
    return queryset
    

  def update(self, instance, validated_data):
    try:
      need_to_save = False
      if 'first_name' in validated_data:
        instance.first_name = validated_data.get('first_name', instance.first_name)
        need_to_save = True

      if 'last_name' in validated_data:
        instance.last_name = validated_data.get('last_name', instance.last_name)
        need_to_save = True

      if 'email' in validated_data:
        instance.email = validated_data.get('email', instance.email)
        need_to_save = True

      if 'person' in validated_data:
        person_instance = Person.objects.get(pk=instance.person.id)
        validated_person_data = validated_data.get('person', person_instance)
        need_to_save_person = False

        if 'middle_name' in validated_person_data:
          person_instance.middle_name = validated_person_data.get('middle_name', person_instance.middle_name)
          need_to_save_person = True

        if 'telephone_number' in validated_person_data:
          person_instance.telephone_number = validated_person_data.get('telephone_number', person_instance.telephone_number)
          need_to_save_person = True

        if 'city' in validated_person_data:
          person_instance.city = validated_person_data.get('city', person_instance.city)
          need_to_save_person = True

        if 'state' in validated_person_data:
          person_instance.state = validated_person_data.get('state', person_instance.state)
          need_to_save_person = True

        if 'address_line_1' in validated_person_data:
          person_instance.address_line_1 = validated_person_data.get('address_line_1', person_instance.address_line_1)
          need_to_save_person = True

        if 'address_line_2' in validated_person_data:
          person_instance.address_line_2 = validated_person_data.get('address_line_2', person_instance.address_line_2)
          need_to_save_person = True

        if 'address_line_3' in validated_person_data:
          person_instance.address_line_3 = validated_person_data.get('address_line_3', person_instance.address_line_3)
          need_to_save_person = True

        if 'zipcode' in validated_person_data:
          person_instance.zipcode = validated_person_data.get('zipcode', person_instance.zipcode)
          need_to_save_person = True

        if 'photo' in validated_person_data: 
          person_instance.photo = validated_person_data.get('photo', person_instance.photo)
          need_to_save_person = True

        if 'biography' in validated_person_data:
          person_instance.biography = validated_person_data.get('biography', person_instance.biography)
          need_to_save_person = True

        if need_to_save_person:
          person_instance.save()

      if 'privacy_preferences' in validated_data:
        privacy_preferences_instance = PrivacyPreferences.objects.get(pk=instance.privacy_preferences.id)
        validated_privacy_data = validated_data.get('privacy_preferences', privacy_preferences_instance)
        need_to_save_privacy = False

        if 'is_share_email' in validated_privacy_data:
          privacy_preferences_instance.is_share_email = validated_privacy_data.get('is_share_email', privacy_preferences_instance.is_share_email)
          need_to_save_privacy = True

        if 'is_share_phone' in validated_privacy_data:
          privacy_preferences_instance.is_share_phone = validated_privacy_data.get('is_share_phone', privacy_preferences_instance.is_share_phone)
          need_to_save_privacy = True

        if 'is_share_address' in validated_privacy_data:
          privacy_preferences_instance.is_share_address = validated_privacy_data.get('is_share_address', privacy_preferences_instance.is_share_address)
          need_to_save_privacy = True

        if need_to_save_privacy:
          privacy_preferences_instance.save()

      if 'notification_preferences' in validated_data:
        notification_preferences_instance = NotificationPreferences.objects.get(pk=instance.notification_preferences.id)
        validated_notification_data = validated_data.get('notification_preferences', notification_preferences_instance)
        need_to_save_notifications = False

        if 'notify_by_email' in validated_notification_data:
          notification_preferences_instance.notify_by_email = validated_notification_data.get('notify_by_email', notification_preferences_instance.notify_by_email)
          need_to_save_notifications = True

        if 'notify_by_text' in validated_notification_data:
          notification_preferences_instance.notify_by_text = validated_notification_data.get('notify_by_text', notification_preferences_instance.notify_by_text)
          need_to_save_notifications = True

         
        if need_to_save_notifications:
          notification_preferences_instance.save()
      
      if need_to_save:
        instance.save()

      updated_instance = User.objects.get(pk=instance.id)
      return updated_instance
    except Exception as e:
      raise e

class UserReferenceSerializer(serializers.Serializer):
  id = serializers.IntegerField()
  newest_update = serializers.SerializerMethodField(required=False)
  
  def get_newest_update(self, obj):
    return obj.person.newest_update

  @staticmethod
  def security_trim_and_eager_load(queryset, request):
    # Reuse while it's a truly identical implementation
    return UserSerializer.security_trim_and_eager_load(queryset, request)


class SearchUsersRequestSerializer(serializers.Serializer):
  query = serializers.CharField(max_length=50)

class UserDisplayReferenceSerializer(UserReferenceSerializer):
  first_name = serializers.CharField(max_length=User._meta.get_field('first_name').max_length, required=False)
  last_name = serializers.CharField(max_length=User._meta.get_field('last_name').max_length, required=False)
  email = serializers.EmailField()

  @staticmethod
  def security_trim_and_eager_load(queryset, request):
    # Reuse while it's a truly identical implementation
    return UserSerializer.security_trim_and_eager_load(queryset, request)