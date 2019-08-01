import copy
from django.conf import settings
from django.contrib.auth.models import Group, User
from django.core.paginator import Paginator
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dashboard.models import Post, CategoryStatistics
from groups.models import Circle
from users.models import Membership, Tokens
from api_v1.containers.loop.membership.status_helpers import is_user_admin_of_group
from api_v1.containers.loop.serializers import GroupSerializer
from api_v1.containers.post.serializers import PostReferenceSerializer
from api_v1.serializers import BatchRequestSerializer
from api_v1.containers.user.serializers import UserReferenceSerializer

class GroupViewSet(viewsets.ModelViewSet):
  serializer_class = GroupSerializer
  http_method_names = ['get', 'head', 'post', 'put', 'patch']

  def get_queryset(self):
    return self.request.user.groups.all()

  def create(self, request, *args, **kwargs):
    # Add the current user information to the new loop
    user = request.user

    # If creating new loops is restricted
    if(settings.RESTRICT_LOOP_CREATION):
      # and if the user has not directly been granted the ability to create loops...
      if not user.person.can_create_loops:
        allowed_loops = settings.RESTRICT_LOOP_CREATION_ALLOWED_LOOPS.split(',')
        # and if they aren't in any of the loops granted the ability
        if not user.groups.filter(id__in=allowed_loops).exists():
          # then forbid the action
          return Response(status=status.HTTP_403_FORBIDDEN)

    # Load the data into the serializer
    data = copy.deepcopy(request.data)
    data['founder_id'] = user.id
    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)
    
    # Block creating a loop for any user with no tokens available
    # user_token = Tokens.objects.get(user__id=user.id)
    # if user_token.create_loop < 1:
    #   return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    self.perform_create(serializer)
    created_group = Group.objects.get(pk=serializer.data['id'])
    CategoryStatistics.calculate_statistics_for_group(created_group)

    # Report success
    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

  def update(self, request, *args, **kwargs):
    user = request.user
    groups = user.groups.all()
    partial = kwargs.pop('partial', False)
    instance = self.get_object()

    # ensure the current user is an admin in the group
    data = copy.deepcopy(request.data)

    group_id = data['id']
    is_group_admin = is_user_admin_of_group(user.id, group_id)
    if not is_group_admin or not groups.filter(pk=group_id).exists():
      return Response(status=status.HTTP_403_FORBIDDEN)

    # Load the data into the serializer
    serializer = self.get_serializer(instance, data=data, partial=partial)
    serializer.is_valid(raise_exception=True)

    try:
      self.perform_update(serializer)
    except Exception as e:
      raise e

    updated_instance = Group.objects.get(pk=instance.id)
    updated_serializer = self.get_serializer(updated_instance)
    return Response(updated_serializer.data)


@api_view(['GET'])
def get_loop_users(request, loop_id, format=None):
  user = request.user
  is_user_in_group = user.groups.filter(pk=loop_id).exists()

  if not is_user_in_group:
    return Response(status=status.HTTP_403_FORBIDDEN)

  circle = Circle.objects.get(group__id=loop_id)
  user_references = circle.get_user_references()
  return Response(user_references)
  # user_query = User.objects.filter(groups__id=loop_id).distinct()
  # user_query = UserReferenceSerializer.security_trim_and_eager_load(user_query, request)

  # # TODO: come up with a great sort order
  
  # if (request.GET.get('page')):
  #   page = request.GET.get('page')
  #   paginator = Paginator(user_query, 15)
  #   user_query = paginator.page(page)

  # serializer = UserReferenceSerializer(user_query, many=True)
  # return Response(serializer.data)


@api_view(['POST'])
def request_multiple_groups(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    user = request.user
    query_set = user.groups.all()
    query_set = query_set.filter(pk__in=request_serializer.data['ids']).distinct('id')

    response_serializer = GroupSerializer(query_set, many=True)
    return Response(response_serializer.data)


