import json
from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer, CreationDateTrackedSerializer, ModelTrackedSerializer
from dashboard.models import Category, CategoryStatistics


class CategorySerializer(
    DatabaseItemBaseSerializer, 
    CreationDateTrackedSerializer, 
    ModelTrackedSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=Category._meta.get_field('name').max_length, required=False)
    date_added = serializers.DateTimeField()
    parent_id = serializers.PrimaryKeyRelatedField(source="parent", read_only=True)
    path_name = serializers.CharField(max_length=Category._meta.get_field('path_name').max_length)
    always_show_in_menus = serializers.BooleanField(required=False)


class CategoryStatisticsSerializer(
    DatabaseItemBaseSerializer, 
    CreationDateTrackedSerializer, 
    ModelTrackedSerializer):
    id = serializers.IntegerField(read_only=True)
    category_id = serializers.IntegerField(read_only=True)
    group_id = serializers.IntegerField(read_only=True)
    post_count = serializers.IntegerField(read_only=True)
    post_references = serializers.SerializerMethodField()

    def get_post_references(self, obj):
        post_references = json.loads(obj.post_references)
        return post_references