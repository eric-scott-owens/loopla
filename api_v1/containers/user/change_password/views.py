import copy
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from api_v1.containers.registration.views import get_password_validation_errors
from api_v1.containers.user.change_password.serializers import ChangePasswordSerializer

@api_view(['POST'])
def change_password(request, format=None):
  data = copy.deepcopy(request.data)
  serializer = ChangePasswordSerializer(data=data)
  serializer.is_valid(raise_exception=True)

  user = request.user
  old_password = serializer.data['old_password']
  new_password = serializer.data['new_password']
  user_id = serializer.data['user_id']

  if not user.check_password(old_password) or user.id != user_id:
    return Response(status=status.HTTP_403_FORBIDDEN)

  validation_errors = get_password_validation_errors(new_password, user)

  if len(validation_errors) > 0:
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  user.set_password(new_password)
  user.save()

  return Response(status=status.HTTP_200_OK)

  