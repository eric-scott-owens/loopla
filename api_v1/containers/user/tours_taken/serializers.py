from django.contrib.auth.models import User
from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer

class ToursTakenSerializer(DatabaseItemBaseSerializer):
  dashboard = serializers.SerializerMethodField()
  post_editor = serializers.SerializerMethodField()

  def get_dashboard(self, obj):
    return not not obj.dashboard_tour_date

  def get_post_editor(self, obj):
    return not not obj.post_editor_tour_date

class ReportTakenTourSerializer(serializers.Serializer):
  tour_taken = serializers.CharField(max_length=100)