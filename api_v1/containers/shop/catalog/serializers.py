from rest_framework import serializers
from api_v1.containers.kudos.serializers import KudosSerializer
from api_v1.serializers import DatabaseItemBaseSerializer


class CollectionSerializer(DatabaseItemBaseSerializer):
  title = serializers.CharField()
  description = serializers.CharField()
  artist = serializers.CharField()
  photo = serializers.ImageField()
  kudos_ids = serializers.ListField(child=serializers.CharField())


class CatalogItemSerializer(DatabaseItemBaseSerializer):
  sku = serializers.CharField()
  kudos = KudosSerializer(many=True)
  collection = CollectionSerializer(many=True)
  price = serializers.IntegerField()
  title = serializers.CharField()
  description = serializers.CharField()
  start_date = serializers.DateField()
  end_date = serializers.DateField()
