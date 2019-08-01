from rest_framework import serializers
from commands.models import JavaScriptClientCommand
from api_v1.serializers import DatabaseItemBaseSerializer

class JavaScriptClientCommandSerializer(DatabaseItemBaseSerializer):
  command = serializers.CharField(read_only=True)
