from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from itk_invitations.models import Invitation
from PIL import Image
from django.http import JsonResponse
from api_v1.containers.loop.invitations.serializers import InvitationSerializer
from itk_invitations.models import UnregisteredUser
from django.contrib.auth.models import Group, User
from users.models import Membership
from rest_framework.response import Response


class InvitationViewSet(viewsets.ModelViewSet):
  serializer_class = InvitationSerializer
  http_method_names = ['get', 'head']

  def get_queryset(self):
    user = self.request.user
    groups = user.groups.all()
    invitations = Invitation.objects.filter(group__in=groups)

    # TODO: Filter to only groups for which the member is an admin

    if (self.request.GET.get('loop')):
      group_id = self.request.GET.get('loop')
      invitations = invitations.filter(group__id=group_id)

    if (self.request.GET.get('is_accepted')):
      is_accepted = self.request.GET.get('is_accepted').lower() == 'true'
      invitations = invitations.filter(is_accepted=is_accepted)

    invitations = invitations.order_by('id').distinct('id')
    return invitations

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def record_invitation_email_opened(self):
  # record opening of the email
  if(self.GET.get('id')):
    invitation_id = self.GET.get('id')
    invitation = Invitation.objects.get(id=invitation_id)
    if invitation:
      if not invitation.read_email_timestamp:
        invitation.read_email_timestamp = timezone.now()
        invitation.save()

  # get the image to return
  file_path = staticfiles_storage.open('api_v1/empty.png')
  image = Image.open(file_path)
  response = HttpResponse(content_type="image/png")
  image.save(response, "PNG")
  return response

@permission_classes((AllowAny,))
def get_invitation_page(self):
  invitation = Invitation.objects.get(key=self.GET.get('key'))
  inviter = invitation.inviter.first_name + " " + invitation.inviter.last_name
  full_invitee = UnregisteredUser.objects.get(id=invitation.invitee_id)
  invitee = {
    'first_name': full_invitee.first_name,
    'last_name': full_invitee.last_name,
    'email': full_invitee.email
  }
  temp_group = Group.objects.get(id=invitation.group_id)
  temp_memberships = Membership.objects.filter(group_id=temp_group.id)
  temp_members = []
  temp_organizers = []
  for membership in temp_memberships: 
    temp_user = User.objects.get(id=membership.user_id)
    user_name = temp_user.first_name + " " + temp_user.last_name
    temp_members.append(user_name)
    if(membership.is_coordinator):
      temp_organizers.append(user_name)
      


  temp_invitations = Invitation.objects.filter(group_id=temp_group.id, is_accepted=False, is_declined=False)
  temp_invitees = []
  for one_invitee in temp_invitations: 
    # if there is a user with this confirmed ID use that
    # else use the invitee (not confirmed) first and last name
    if (one_invitee.confirmed_invitee_id):
      temp_user = User.objects.get(id=one_invitee.confirmed_invitee_id)
      user_name = temp_user.first_name + " " + temp_user.last_name
    else:
      user_name = one_invitee.invitee.first_name + " " + one_invitee.invitee.last_name

    temp_invitees.append(user_name)

  group = {
    'id': temp_group.id,
    'name': temp_group.circle.name,
    'description': temp_group.circle.description,
    'created': temp_group.circle.date_created,
    'organizers': temp_organizers,
    'members': temp_members,
    'invited': temp_invitees,
  }

  invitation_page = {
    'invitation_id': invitation.id,
    'invitation_key': invitation.key,
    'group': group,
    'inviter': inviter,
    'invitee': invitee,
  }

  return JsonResponse({
      'invitation_page': invitation_page
  })

@api_view(['POST'])
def accept_invitation(request):
  invitation = Invitation.objects.get(key=request.data)
  invitation.accept(request.user)
  return Response({"detail": "Invitation Accepted"},status=status.HTTP_200_OK)