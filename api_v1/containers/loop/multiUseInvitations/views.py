from rest_framework import viewsets, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from itk_invitations.models import MultiUseInvitation
from django.http import JsonResponse
from api_v1.containers.loop.multiUseInvitations.serializers import MultiUseInvitationSerializer
from itk_invitations.models import UnregisteredUser
from django.contrib.auth.models import Group, User
from users.models import Membership
from rest_framework.response import Response
from django.utils.crypto import get_random_string

@permission_classes((AllowAny,))
def get_multi_use_invitation_page(self):
  invitation_key = self.GET.get('key')
  checked_invitations = MultiUseInvitation.objects.filter(key = invitation_key)
  
  if not checked_invitations.exists():
    return Response(status=status.HTTP_401_UNAUTHORIZED)

  invitation = MultiUseInvitation.objects.get(key=invitation_key)
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

  group = {
    'id': temp_group.id,
    'name': temp_group.circle.name,
    'description': temp_group.circle.description,
    'created': temp_group.circle.date_created,
    'organizers': temp_organizers,
    'members': temp_members,
  }

  multi_use_invitation_page = {
    'invitation_id': invitation.id,
    'invitation_key': invitation.key,
    'invitation_is_visible': invitation.is_visible,
    'group': group,
  }

  return JsonResponse({
      'multi_use_invitation_page': multi_use_invitation_page
  })

def get_multi_use_invitation_page_by_group(self):
  group_id = self.GET.get('group_id', None)
  group_selected = Group.objects.get(id= group_id)
  invitation = MultiUseInvitation.objects.get(group__id=group_id)
  group = {
    'id': group_selected.id,
    'name': group_selected.circle.name,
    'description': group_selected.circle.description,
    'created': group_selected.circle.date_created
  }

  multi_use_invitation_page = {
    'invitation_id': invitation.id,
    'invitation_key': invitation.key,
    'invitation_is_visible': invitation.is_visible,
    'group': group,
  }

  return JsonResponse({
      'multi_use_invitation_page': multi_use_invitation_page
  })

@api_view(['POST'])
def accept_multi_use_invitation(request):
  invitation = MultiUseInvitation.objects.get(key=request.data)
  invitation.accept(request.user)
  return Response({"detail": "Invitation Accepted"},status=status.HTTP_200_OK)

def update_visibility_multi_use_invitation(request):
  invitation_key = request.GET.get('key')
  invitation = MultiUseInvitation.objects.get(key=invitation_key)
  invitation.is_visible = not invitation.is_visible
  invitation.save()
  temp_group = Group.objects.get(id=invitation.group_id)

  group = {
    'id': temp_group.id,
    'name': temp_group.circle.name,
    'description': temp_group.circle.description,
    'created': temp_group.circle.date_created
  }

  multi_use_invitation_page = {
    'invitation_id': invitation.id,
    'invitation_key': invitation.key,
    'invitation_is_visible': invitation.is_visible,
    'group': group,
  }

  return JsonResponse({
      'multi_use_invitation_page': multi_use_invitation_page
  })

def create_new_multi_use_invitation_key(request):
  invitation_key = request.GET.get('key')
  invitation = MultiUseInvitation.objects.get(key=invitation_key)
  invitation_key = get_random_string(64).lower()
  checked_invitations = MultiUseInvitation.objects.filter(key = invitation_key)
  while checked_invitations.exists():
    invitation_key = get_random_string(64).lower()
    checked_invitations = MultiUseInvitation.objects.filter(key = invitation_key)
  invitation.key = invitation_key
  invitation.save()
  temp_group = Group.objects.get(id=invitation.group_id)

  group = {
    'id': temp_group.id,
    'name': temp_group.circle.name,
    'description': temp_group.circle.description,
    'created': temp_group.circle.date_created
  }

  multi_use_invitation_page = {
    'invitation_id': invitation.id,
    'invitation_key': invitation.key,
    'invitation_is_visible': invitation.is_visible,
    'group': group,
  }

  return JsonResponse({
      'multi_use_invitation_page': multi_use_invitation_page
  })