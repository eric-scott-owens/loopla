from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer


class KudosSerializer(DatabaseItemBaseSerializer):
  sticker = serializers.ImageField()
  title = serializers.CharField()
  description = serializers.CharField()
  artist = serializers.CharField()
  limited_count = serializers.IntegerField()


class KudosAvailableSerializer(DatabaseItemBaseSerializer):
  user_id = serializers.PrimaryKeyRelatedField(read_only=True)
  kudos_id = serializers.PrimaryKeyRelatedField(read_only=True)
  edition_number = serializers.IntegerField(read_only=True)
  order_id = serializers.PrimaryKeyRelatedField(read_only=True)
