import api_v1.containers.user.summary_preferences.serializers as summary_preferences_serializers
import users.models as user_models
from rest_framework import viewsets
from django.contrib.auth.models import User, Group
import copy
from rest_framework.response import Response


class SummaryPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = summary_preferences_serializers.SummaryPreferencesSerializer
    http_method_names = ['get', 'head', 'put', 'patch']

    def get_queryset(self):
        return_preferences = user_models.SummaryPreferences.objects.all()

        if(self.request.GET.get('userId')):
            return_preferences = return_preferences.filter(user_id=self.request.GET.get('userId'))

        if(self.request.GET.get('groupId')):
            return_preferences = return_preferences.filter(group_id=self.request.GET.get('groupId'))

        return return_preferences

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # ensure the current user is the owner
        if instance.user_id != request.user.id:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = copy.deepcopy(request.data)

        # # Load the data into the serializer
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_update(serializer)
        except Exception as e:
            raise e

        updated_instance = user_models.SummaryPreferences.objects.get(pk=instance.id)
        updated_serializer = self.get_serializer(updated_instance)
        return Response(updated_serializer.data)