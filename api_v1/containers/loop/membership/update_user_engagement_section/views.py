from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api_v1.containers.loop.membership.serializers import MembershipSerializer
import api_v1.containers.loop.membership.update_user_engagement_section.serializers as serializers
from api_v1.containers.loop.membership.status_helpers import is_user_admin_of_group
from groups import email_text_utils, utils as group_utils, models as group_models
import django.contrib.auth.models as auth_models
from users.models import Membership
import copy

@api_view(['POST'])
def update_user_engagement_section(request, format=None):
  serializer = serializers.UpdateUserEngagementSectionSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)
  membership = Membership.objects.get(user__id=serializer.data['user_id'], group__id=serializer.data['group_id'])
  if (request.user.id != serializer.data['user_id']):
    return Response(status=status.HTTP_403_FORBIDDEN)
  membership.user_engagement_section_dismissed = serializer.data['user_engagement_section_dismissed']
  membership.save()
  updated_serializer = MembershipSerializer(membership)
  return Response(updated_serializer.data)
# Finish this function