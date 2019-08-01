from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer
from shop.models import Order, OrderItem, OrderStatusTransition


class OrderItemSerializer(DatabaseItemBaseSerializer):
  amount = serializers.IntegerField(read_only=True)
  currency = serializers.CharField(read_only=True)
  description = serializers.CharField(read_only=True)
  parent = serializers.CharField(read_only=True)
  quantity = serializers.IntegerField(read_only=True)
  item_type = serializers.CharField(read_only=True)


class CreateNewOrderSerializer(serializers.Serializer):
  order_items = OrderItemSerializer(many=True)


class ProcessOrderSerializer(serializers.Serializer):
  order_id = serializers.CharField(max_length=Order._meta.get_field('order_id').max_length)
  stripe_token = serializers.CharField(max_length=50)


class OrderStatusTransitionSerializer(serializers.Serializer):
  status = serializers.CharField(max_length=OrderStatusTransition._meta.get_field('status').max_length, read_only=True)
  created = serializers.DateTimeField(read_only=True)


class OrderSerializer(serializers.Serializer):
  order_id = serializers.CharField(max_length=Order._meta.get_field('order_id').max_length, read_only=True)
  user_id = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
  amount = serializers.IntegerField(read_only=True)
  status = serializers.CharField(max_length=Order._meta.get_field('status').max_length, read_only=True)
  status_transitions = OrderStatusTransitionSerializer(many=True)
  items = OrderItemSerializer(many=True)
