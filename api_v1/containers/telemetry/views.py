import copy
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from actions.models import SimpleAction, NavigationAction
from django.conf import settings
from api_v1.authentication import AuthenticatedOrAnonymousAuthentication

@api_view(['POST'])
def log_simple_action(request):
  data = copy.deepcopy(request.data)
  if not 'action_type' in data:
    return Response(status=status.HTTP_400_BAD_REQUEST)

  action_name = data['action_type']
  SimpleAction.log_simple_action(request.user, action_name)
  return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes((AuthenticatedOrAnonymousAuthentication,))
@permission_classes((AllowAny,))
def log_navigation_action(request):
  data = copy.deepcopy(request.data)
  if not 'url' in data:
    return Response(status=status.HTTP_400_BAD_REQUEST)

  navigation_action = NavigationAction()
  navigation_action.url = data['url']

  if request.user.is_authenticated():
    navigation_action.user = request.user
  
  if 'previous_url' in data:
    navigation_action.previous_url = data['previous_url']

  navigation_action.save()
  return Response(status=status.HTTP_200_OK)