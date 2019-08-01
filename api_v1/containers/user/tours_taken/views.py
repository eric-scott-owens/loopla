import copy
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import ToursTaken
from api_v1.containers.user.tours_taken.serializers import ReportTakenTourSerializer

@api_view(['POST'])
def report_taken_tour(request):
  data = copy.deepcopy(request.data)
  request_serializer = ReportTakenTourSerializer(data=data)
  request_serializer.is_valid(raise_exception=True)

  taken_tour_attribute = '%s_tour_date' % request_serializer.data['tour_taken']
  tours_taken = ToursTaken.objects.get(user_id=request.user.id)

  if hasattr(tours_taken, taken_tour_attribute):
    setattr(tours_taken, taken_tour_attribute, datetime.utcnow())
    tours_taken.save()
    return Response(status=status.HTTP_200_OK)
  else:
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

