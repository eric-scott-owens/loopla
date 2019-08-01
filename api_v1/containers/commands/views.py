from rest_framework import viewsets, status
from rest_framework.response import Response
from commands.models import JavaScriptClientCommand
from api_v1.containers.commands.serializers import JavaScriptClientCommandSerializer

class JavaScriptClientCommandViewSet(viewsets.ModelViewSet):
  serializer_class = JavaScriptClientCommandSerializer
  http_method_names = ['get']

  def get_queryset(self):
    commands_query = JavaScriptClientCommand.objects.all()

    if (self.request.GET.get('gt')):
      greater_than = self.request.GET.get('gt')
      commands_query = commands_query.filter(id__gt=greater_than)

    commands_query.order_by('id')

    return commands_query