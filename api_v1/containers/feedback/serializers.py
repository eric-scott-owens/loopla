from django.contrib.auth.models import User, Group
from rest_framework import serializers
from dashboard.models import UserFeedback
import api_v1.utilities.image_utilities as image_utils
from django.urls import reverse
from django.conf import settings
from api_v1.containers.components.photo_collection.serializers import UsesPhotoCollectionComponent
from communications.utilities import compose_email, safe_send_email

class UserFeedbackSerializer(UsesPhotoCollectionComponent):
  owner = serializers.IntegerField(read_only=True, source="owner_id")
  owner_id = serializers.IntegerField(required=False, write_only=True)
  text = serializers.CharField(required=False)
  
  def send_email(self, feedback):
    subject = "New Feedback"
    context = {'feedback': feedback}
    email = compose_email(subject, "email_feedback.html", context)
    email.to.append(settings.NOTIFICATIONS_SERVICE_ADMIN_EMAIL_ADDRESS)
    safe_send_email(email)

  def create(self, validated_data):
    try:
        feedback = UserFeedback(validated_data)
        feedback.id = None
        feedback.owner = User.objects.get(pk=validated_data['owner_id'])
        feedback.text = validated_data['text']
        feedback.group = Group.objects.get(pk=settings.ADMIN_LOOP)
        feedback.save()          
        # The permissions in save_photo_collections are different here than usual
        # The owner of this feedback does not belong to our admin group
        image_utils.save_photo_collections(feedback, validated_data['photo_collections'], feedback.group, feedback.owner)

        self.send_email(feedback)
        return feedback
    except Exception as e:
        raise e

