from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer, CreationDateTrackedSerializer, ModelTrackedSerializer
from dashboard.models import Tag


class TagSerializer(
    DatabaseItemBaseSerializer, 
    CreationDateTrackedSerializer, 
    ModelTrackedSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=Tag._meta.get_field('name').max_length, required=False)

    def create(self, validated_data):
        try:
            tag = Tag(validated_data)
            tag.name = validated_data['name']
            tag.id = None
            tag.save()
            return tag
        except Exception as e:
            raise e

class TagReferenceSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)