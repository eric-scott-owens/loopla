from rest_framework import serializers

class ChangePasswordSerializer(serializers.Serializer):
  old_password = serializers.CharField(max_length=4096)
  new_password = serializers.CharField(max_length=4096)
  user_id = serializers.IntegerField()