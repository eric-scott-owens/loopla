import copy
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dashboard.models import Place
from api_v1.containers.place.serializers import PlaceSerializer
from api_v1.serializers import BatchRequestSerializer

class PlaceViewSet(viewsets.ModelViewSet):
    serializer_class = PlaceSerializer
    http_method_names = ['get', 'head']

    def get_queryset(self):
        return_places = Place.objects.all()
        if(self.request.GET.get('name')):
            placeName = self.request.GET.get('name')
            return_place = return_places.filter(name__iexact=placeName).order_by('name').distinct('name')
            return return_place
        if(self.request.GET.get('id')):
            placeId = self.request.GET.get('id')
            return_place = return_places.filter(id=id)
            return return_place

        return return_places

@api_view(['POST'])
def request_multiple_places(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    query_set = Place.objects.filter(pk__in=request_serializer.data['ids']).distinct('id')

    response_serializer = PlaceSerializer(query_set, many=True)
    return Response(response_serializer.data)
