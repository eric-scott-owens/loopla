import copy
from django.conf import settings
from django.db import transaction
from django.db.models import Count
from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from actions.models import SimpleAction, ReceivedKudosToComment, ReceivedKudosToPost, SentKudosToComment, SentKudosToPost
from api_v1.containers.kudos.serializers import KudosAvailableSerializer, KudosSerializer
from api_v1.containers.kudos.kudos_given.serializers import KudosGivenSerializer
from communications.utilities import safe_send_text
from dashboard.models import Post, Comment
from shop.models import Kudos, KudosAvailable, KudosGiven

class KudosViewSet(viewsets.ModelViewSet):
  serializer_class = KudosSerializer
  http_method_names = ['get', 'head']

  def get_queryset(self):
    kudos = Kudos.objects.all()
    return kudos


@api_view(['GET'])
def get_available_kudos(request, format=None):
  kudos_available = KudosAvailable.objects.filter(user__id=request.user.id).values('kudos_id').annotate(quantity=Count('kudos_id'))
  return_kudos = {}

  for kudo in kudos_available:
    return_kudos[kudo['kudos_id']] = kudo['quantity']
  
  return JsonResponse(return_kudos)

@api_view(['POST'])
def give_kudos(request, format=None):
  data = copy.deepcopy(request.data)
  
  serializer = KudosGivenSerializer(data=data)
  serializer.is_valid(raise_exception=True)

  user = request.user
  thing = None

  content_type = data['content_type']
  object_id = data['object_id']

  if content_type == 'Post':
    thing = Post.objects.get(id=object_id)
  elif content_type == 'Comment':
    thing = Comment.objects.get(id=object_id)
  else:
    raise ValueError('Invalid modelType')

  # Check if this user is the owner of this thing
  if thing.owner == user:
    return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)

  # # Check if this user has already given kudos for this thing
  if thing.kudos_received.filter(giver=user).exists():
    return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)
  
  # Good to go. 
  # Add the KudosGiven and remove the used KudosAvailable in a single transaction so
  # that race conditions can't allow a KudosAvailable to be used twice by mistake
  with transaction.atomic():
    # Add the given kudos
    kudos_id = data['kudos_id']
    kudos = Kudos.objects.get(id=kudos_id)
    
    # Grab the first kudo that matches this filter
    kudos_available = KudosAvailable.objects.filter(kudos__id=kudos_id, user__id=user.id).order_by('edition_number')[0]
    
    edition_number = kudos_available.edition_number
    order = kudos_available.order
    
    # Make new KudosGiven with the data from the available
    kudos_given = KudosGiven(
      content_object=thing,
      giver = user,
      receiver = thing.owner,
      kudos = kudos,
      note = data['note'],
      edition_number = edition_number,
      order = order
    )
    kudos_given.save()
  
    # Remove the available kudos so it can't be used again
    kudos_available.delete()

  # # log the creation event
  SimpleAction.log_simple_action(user, 'give_kudos')
  if(content_type == 'Post'):
    SimpleAction.log_simple_action(user, 'give_post_kudos')
    ReceivedKudosToPost.objects.create(user=thing.owner, post=thing, sender=user, is_notified=True)
    SentKudosToPost.objects.create(user=user, post=thing, is_notified=False)

    
  if(content_type == 'Comment'):
    SimpleAction.log_simple_action(user, 'give_comment_kudos')
    ReceivedKudosToComment.objects.create(user=thing.owner, comment=thing, sender=user, is_notified=True)
    SentKudosToComment.objects.create(user=user, comment=thing, is_notified=False)

  # try to send notifications
  # safe_send_text(message=message,recipient=thing.owner.person.telephone_number.as_e164)

  updated_kudos_given = KudosGiven.objects.get(pk=kudos_given.id)
  response_serializer = KudosGivenSerializer(updated_kudos_given)
  return Response(response_serializer.data)
  
