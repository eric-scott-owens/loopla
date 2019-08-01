import copy
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from shop.models import KudosGiven
from api_v1.containers.kudos.kudos_given.serializers import KudosGivenSerializer
from api_v1.serializers import BatchRequestSerializer

class KudosGivenViewSet(viewsets.ModelViewSet):
  serializer_class = KudosGivenSerializer
  http_method_names = ['get', 'head']

  def get_queryset(self):
    queryset = KudosGivenSerializer.security_trim_and_eager_load(self.request, KudosGiven.objects.all())
    return queryset
    

@api_view(['POST'])
def request_multiple_kudos_given(request):
  data = copy.deepcopy(request.data)
  request_serializer = BatchRequestSerializer(data=data)
  request_serializer.is_valid(raise_exception=True)

  query_set = KudosGivenSerializer.security_trim_and_eager_load(KudosGiven.objects.all(), request)
  query_set = query_set.filter(pk__in=request_serializer.data['ids']).order_by('id').distinct('id')

  response_serializer = KudosGivenSerializer(query_set, many=True)
  return Response(response_serializer.data)
  