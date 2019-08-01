from rest_framework import serializers
from dashboard.models import Place
from api_v1.serializers import DatabaseItemBaseSerializer, CreationDateTrackedSerializer, ModelTrackedSerializer

class PlaceSerializer(
    DatabaseItemBaseSerializer, 
    CreationDateTrackedSerializer,
    ModelTrackedSerializer):
    id = serializers.IntegerField(required=False)
    is_user_generated = serializers.BooleanField(required=False)
    name = serializers.CharField(max_length=Place._meta.get_field('name').max_length,required=False)


class PlaceReferenceSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)

class MentionedPlaceReferenceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    owner_ids = serializers.ListField(child=serializers.IntegerField())