from django.db.models import Q
from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer, GenericRelationshipSerializer
from shop.models import KudosGiven, Kudos

class KudosGivenSerializer(DatabaseItemBaseSerializer, GenericRelationshipSerializer):
  giver_id = serializers.PrimaryKeyRelatedField(source="giver", read_only=True, required=False)
  receiver_id = serializers.PrimaryKeyRelatedField(source="receiver", read_only=True, required=False)
  kudos_id = serializers.PrimaryKeyRelatedField(source="kudos", queryset=Kudos.objects)
  order_id = serializers.PrimaryKeyRelatedField(source="order", read_only=True, required=False)

  note = serializers.CharField(max_length=KudosGiven._meta.get_field('note').max_length, required=False)
  edition_number = serializers.IntegerField(read_only=True, required=False)

  @staticmethod
  def security_trim_and_eager_load(queryset, request): 
    user = request.user
    queryset = queryset.filter(Q(receiver=user) | Q(giver=user))
    
    return queryset