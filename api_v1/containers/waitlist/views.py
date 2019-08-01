import copy
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from api_v1.containers.waitlist.serializers import KeepInContactSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

class WaitlistViewSet(viewsets.ModelViewSet):
  permission_classes = (AllowAny,)
  serializer_class = KeepInContactSerializer

  def get_queryset(self):
    # gonna do stuff...
    return 

  def create(self, request, *args, **kwargs):
    data = copy.deepcopy(request.data)
    data.pop('id', None)
    # Load the data into the serializer
    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)
    #Create the new object
    self.perform_create(serializer)

    # Report success
    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)