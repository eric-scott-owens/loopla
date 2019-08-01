from rest_framework import serializers
from api_v1.serializers import DatabaseItemBaseSerializer
import users.models as user_models

class SummaryPreferencesSerializer(DatabaseItemBaseSerializer):
    id = serializers.IntegerField(min_value=0)
    group_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    send_daily_summary = serializers.BooleanField()
    send_weekly_summary = serializers.BooleanField()

    def update(self, instance, validated_data):
        try:
            need_to_save = False
            if 'send_daily_summary' in validated_data:
                instance.send_daily_summary = validated_data.get('send_daily_summary', instance.send_daily_summary)
                need_to_save = True

            if 'send_weekly_summary' in validated_data:
                instance.send_weekly_summary = validated_data.get('send_weekly_summary', instance.send_weekly_summary)
                need_to_save = True
            
            if need_to_save:
                instance.save()

            updated_instance = user_models.SummaryPreferences.objects.get(pk=instance.id)
            return updated_instance
        except Exception as e:
            raise e
