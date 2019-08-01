from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from users.models import Membership

from api_v1.serializers import ModelTrackedSerializer, OwnableDatabaseItemSerializer, CreationDateTrackedSerializer, GroupRelatedSerializer, OrderableSerializer, GenericComponentSerializer, DatabaseItemBaseSerializer
from dashboard.components.photo_collection import PhotoCollectionComponent, PhotoCollectionPhoto, Photo


class PhotoSerializer(
  OwnableDatabaseItemSerializer, 
  GroupRelatedSerializer,
  CreationDateTrackedSerializer,
  ModelTrackedSerializer):

  caption = serializers.CharField(
    max_length=Photo._meta.get_field('caption').max_length, 
    allow_blank=Photo._meta.get_field('caption').blank,
    required=False
  )

  width = serializers.IntegerField(read_only=True, source="image_width")
  height = serializers.IntegerField(read_only=True, source="image_height")

  image_upload = Base64ImageField(write_only=True, required=False)


class PhotoCollectionPhotoSerializer(OrderableSerializer, DatabaseItemBaseSerializer):
  photo_collection = serializers.PrimaryKeyRelatedField(read_only=True)
  photo = PhotoSerializer()

class PhotoCollectionComponentSerializer(GenericComponentSerializer):
  photo_collection_photos = PhotoCollectionPhotoSerializer(many=True)


class UsesPhotoCollectionComponent(serializers.Serializer):
  photo_collections = PhotoCollectionComponentSerializer(many=True, required=False)

