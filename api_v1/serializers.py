from rest_framework import serializers

class ModelTrackedSerializer(serializers.Serializer):
  model = serializers.SerializerMethodField(required=False, allow_null=True)
  model_type = serializers.CharField(required=False, allow_null=True, write_only=True)

  def get_model(self, obj):
    return type(obj).__name__

class RankableModelSerializer(serializers.Serializer):
  rank = serializers.SerializerMethodField(required=False)

  def get_rank(self, obj):
    #check if rank exists
    if hasattr(obj, 'rank'):
      return obj.rank
    elif isinstance(obj, dict) and 'rank' in obj:
      return obj['rank']
    return 0

class DatabaseItemBaseSerializer(ModelTrackedSerializer):
  id = serializers.IntegerField(required=False, allow_null=True)

class OwnableSerializer(serializers.Serializer):
  owner = serializers.IntegerField(read_only=True, source="owner_id")
  owner_id = serializers.IntegerField(required=False, write_only=True)

class OwnableDatabaseItemSerializer(OwnableSerializer, DatabaseItemBaseSerializer):
  pass

class OrderableSerializer(serializers.Serializer):
    ordering_index = serializers.IntegerField(min_value=0)

class GroupRelatedSerializer(serializers.Serializer):
    group = serializers.PrimaryKeyRelatedField(read_only=True)
    group_id = serializers.IntegerField(required=False, write_only=True)

class CreationDateTrackedSerializer(serializers.Serializer):
  date_added = serializers.DateTimeField(required=False)

class LastModificationDateTrackedSerializer(serializers.Serializer):
  date_modified = serializers.DateTimeField(required=False)

class GenericRelationshipSerializer(serializers.Serializer):
    object_id = serializers.IntegerField(min_value=0, required=False)
    content_type = serializers.CharField(required=False)

class GenericComponentSerializer(DatabaseItemBaseSerializer, GenericRelationshipSerializer, OrderableSerializer):
    class Meta: 
        abstract = True

class BatchRequestSerializer(serializers.Serializer):
  ids = serializers.ListField(child=serializers.IntegerField(min_value=0))

class TargetBatchSizeSerializer(serializers.Serializer):
  target_batch_size = serializers.IntegerField(required=False)

class NewerThanSerializer(serializers.Serializer):
  newer_than = serializers.DateTimeField(required=False)

class OlderThanSerializer(serializers.Serializer):
  older_than = serializers.DateTimeField(required=False)

class EndDateSerializer(serializers.Serializer):
  end_date = serializers.DateTimeField(required=False)