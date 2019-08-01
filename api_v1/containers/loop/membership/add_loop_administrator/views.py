from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
import api_v1.containers.loop.membership.add_loop_administrator.serializers as serializers
from api_v1.containers.loop.membership.status_helpers import is_user_admin_of_group
from itk_invitations.models import UnregisteredUser, Invitation, InvitationMessage
import django.contrib.auth.models as auth_models
import copy

@api_view(['POST'])
def add_loop_administrator(request, format=None):
  data = copy.deepcopy(request.data)

  serializer = serializers.AddLoopAdministratorSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)
  
  user = request.user
  loop_id = data['loop_id']
  invitee = data['invitee']
  message = data['message'] if 'message' in data else None

  is_group_admin = is_user_admin_of_group(user.id, loop_id)
  if not is_group_admin:
    return Response(status=status.HTTP_403_FORBIDDEN)

  group = auth_models.Group.objects.get(id=loop_id)

  try:
    invitee = UnregisteredUser(
      first_name = invitee['first_name'] if 'first_name' in invitee else '',
      middle_name = invitee['middle_name'] if 'middle_name' in invitee else '',
      last_name = invitee['last_name'] if 'last_name' in invitee else '',
      email = invitee['email'] if 'email' in invitee else '',
      phone_number = invitee['phone_number'] if 'phone_number' in invitee else ''
    )
    invitee.save()

    invitation_message = InvitationMessage(message=message)
    invitation_message.save()

    invitation = Invitation.create(
      invitation_type = Invitation.BECOME_GROUP_COORDINATOR,
      group = group,
      inviter = user,
      invitee = invitee,
      invitation_message = invitation_message
    )

    invitation.send(request)

  except:
    return Response(None, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  return Response(None, status=status.HTTP_202_ACCEPTED)