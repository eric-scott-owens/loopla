import os
import mimetypes
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dashboard.components.photo_collection import Photo


api_view(['GET'])
def get_photo_collection_image(request, photo_id, format=None):
  photo = Photo.objects.get(id=photo_id)
  user = request.user

  # block_access = False
  # if not user or (photo.owner != user and not user.groups.filter(id=photo.group.id).exists()):
  #   block_access = True

  # if block_access:
  #   return Response(status=status.HTTP_403_FORBIDDEN)

  content_type = mimetypes.guess_type(photo.image.file.name)
  return HttpResponse(photo.image, content_type=content_type)


api_view(['GET'])
def get_photo_collection_thumbnail(request, photo_id, format=None):
  photo = Photo.objects.get(id=photo_id)
  user = request.user

  # block_access = False
  # if not user or (photo.owner != user and not user.groups.filter(id=photo.group.id).exists()):
  #   block_access = True

  # if block_access:
  #   return Response(status=status.HTTP_403_FORBIDDEN)

  content_type = mimetypes.guess_type(photo.thumbnail.file.name)
  return HttpResponse(photo.thumbnail, content_type=content_type)

