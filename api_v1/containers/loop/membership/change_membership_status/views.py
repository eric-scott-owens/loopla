from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api_v1.containers.loop.membership.serializers import MembershipSerializer
import api_v1.containers.loop.membership.change_membership_status.serializers as serializers
from api_v1.containers.loop.membership.status_helpers import is_user_admin_of_group
from groups import email_text_utils, utils as group_utils, models as group_models
import django.contrib.auth.models as auth_models
from users.models import Membership
import copy

@api_view(['POST'])
def change_membership_status(request, format=None):
  serializer = serializers.ChangeMembershipStatusSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)

  user = request.user
  change_status_type = serializer.data['change_status_type']
  loop_id = serializer.data['loop_id']
  user_id = serializer.data['user_id']
  should_send_message = serializer.data['should_send_message']
  message = serializer.data['message']
  
  is_group_admin = is_user_admin_of_group(user.id, loop_id)
  if not is_group_admin:
    return Response(status=status.HTTP_403_FORBIDDEN)

  status_change_id = group_models.status_change_values[change_status_type]
  status_change_index = [x[0] for x in group_models.STATUS_CHANGE_CHOICES].index(status_change_id)
  status_change_choice =  group_models.STATUS_CHANGE_CHOICES[status_change_index]
  
  # for sending emails for these scenarios
  if status_change_choice[1] == 'member_to_admin': 
    should_send_message = True 
  
  person = auth_models.User.objects.get(pk=user_id)
  group = auth_models.Group.objects.get(pk=loop_id)

  group_utils.change_status(
    request,
    user=user,
    status_change=status_change_choice,
    person=person,
    group=group,
    is_send_email=should_send_message,
    is_initiated_by_user=False,
    note=message
  )

  membership = Membership.objects.get(group__id=loop_id,user__id=user_id)
  membership_serializer = MembershipSerializer(membership)
  return Response(membership_serializer.data)