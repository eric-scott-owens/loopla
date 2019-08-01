import copy, pytz
from datetime import datetime
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from dashboard.models import Post
from users.models import Person
from api_v1.containers.user.serializers import UserSerializer, SearchUsersRequestSerializer, UserDisplayReferenceSerializer
from api_v1.serializers import BatchRequestSerializer

class CurrentUserView(APIView):
  def get(self, request, format=None):
    current_user = User.objects.get(id=request.user.id)
    serialized_user = UserSerializer(current_user)
    return Response(serialized_user.data)

class UserViewSet(viewsets.ModelViewSet):
  serializer_class = UserSerializer
  http_method_names = ['get', 'head', 'put', 'patch'] # POST handled via registration+

  def get_queryset(self):
    user_query = User.objects.all()
    user_query = UserSerializer.security_trim_and_eager_load(user_query, self.request)
    
    if(self.request.GET.get('group')):
      group_id = int(self.request.GET.get('group'))
      user_query = user_query.filter(groups__id=group_id)

    return user_query.distinct('id')

  def get_kudos_for_user(self):
    user_id = self.GET.get('user')
    posts_from_user = Post.objects.filter(owner__id=user_id)
    
    received_count = 0
    for post in posts_from_user:
      received_count = received_count + post.kudos.count()
    kudos_received = received_count
    
    given_count = Post.objects.filter(kudos__id=user_id).count()
    kudos_given = given_count

    kudos = {
      'given': kudos_given,
      'received': kudos_received
    }

    return JsonResponse({
      'kudos': kudos
      })

  @staticmethod
  def decode_base64_file(data):

    def get_file_extension(file_name, decoded_file):
      import imghdr

      extension = imghdr.what(file_name, decoded_file)
      extension = "jpg" if extension == "jpeg" else extension

      return extension

    from django.core.files.base import ContentFile
    import base64
    import six
    import uuid

    # Check if this is a base64 string
    if isinstance(data, six.string_types):
      # Check if the base64 string is in the "data:" format
      if 'data:' in data and ';base64,' in data:
        # Break out the header from the base64 content
        header, data = data.split(';base64,')

      # Try to decode the file. Return validation error if it fails.
      try:
        decoded_file = base64.b64decode(data)
      except TypeError:
        TypeError('invalid_image')

      # Generate file name:
      file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
      # Get the file name extension:
      file_extension = get_file_extension(file_name, decoded_file)

      complete_file_name = "%s.%s" % (file_name, file_extension, )

      return ContentFile(decoded_file, name=complete_file_name)


  def update(self, request, *args, **kwargs):
    partial = kwargs.pop('partial', False)
    instance = self.get_object()

    # ensure the current user is the owner
    if instance.id != request.user.id:
      return Response(status=status.HTTP_403_FORBIDDEN)

    data = copy.deepcopy(request.data)

    person = data['person']
    if 'photo' in person:
      photo = person['photo']
      image = self.decode_base64_file(photo)
      data['person']['photo'] = image

    # # Load the data into the serializer
    serializer = self.get_serializer(instance, data=data, partial=partial)
    serializer.is_valid(raise_exception=True)

    time_just_before_update = datetime.utcnow()
    updated_user = self.perform_update(serializer)
    
    # Noteate the update in the person object
    updated_instance = User.objects.get(pk=instance.id)
    newest_update = updated_instance.person.newest_update
    utc_newest_update = newest_update.replace(tzinfo=pytz.utc)
    utc_time_just_before_update = time_just_before_update.replace(tzinfo=pytz.utc)
    if not utc_newest_update > utc_time_just_before_update:
      Person.objects.filter(pk=instance.person.id).update(newest_update=utc_time_just_before_update)
    
    updated_instance = User.objects.get(pk=instance.id)
    updated_serializer = self.get_serializer(updated_instance)
    return Response(updated_serializer.data)
    
  
@api_view(['POST'])
def request_multiple_users(request):
  data = copy.deepcopy(request.data)
  request_serializer = BatchRequestSerializer(data=data)
  request_serializer.is_valid(raise_exception=True)

  query_set = User.objects.all()
  query_set = UserSerializer.security_trim_and_eager_load(query_set, request)
  query_set = query_set.filter(pk__in=request_serializer.data['ids']).distinct('id')

  response_serializer = UserSerializer(query_set, many=True)
  return Response(response_serializer.data)


@api_view(['POST'])
def search_users(request):
  data = copy.deepcopy(request.data)
  request_serializer = SearchUsersRequestSerializer(data=data)
  request_serializer.is_valid(raise_exception=True)

  query = data['query']
  query_set = User.objects.all()
  query_set = UserDisplayReferenceSerializer.security_trim_and_eager_load(query_set, request)
  query_set = query_set.filter(Q(first_name__icontains=query) | Q(last_name__icontains=query) | Q(email__icontains=query))

  query_set = query_set.order_by('first_name', 'last_name', 'email') # Sort results alphabetically
  query_set = query_set[:5] # only return the top 5 results

  response_serializer = UserDisplayReferenceSerializer(query_set, many=True)
  return Response(response_serializer.data)
