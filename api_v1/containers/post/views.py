import copy
from datetime import datetime, timedelta, timezone
import django_rq
from django.core.paginator import Paginator
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.db.models import Q
from django.db.models.functions import Coalesce, Greatest
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.decorators import api_view
from rest_framework.response import Response
from actions.models import SimpleAction
from dashboard.models import Post, Tag, Category, CategoryStatistics
from users.models import Membership
from api_v1.containers.post.serializers import PostSerializer, NewPostDataSerializer, OlderThanPostReferenceSerializer
from api_v1.containers.loop.membership.utilities import is_active_member
from api_v1.serializers import BatchRequestSerializer, NewerThanSerializer
from api_v1.notification_handlers.notification_handler import send_post_notification_with_worker
from api_v1.utilities.socketio_utilities import try_emit
import api_v1.utilities.socketio_actions as ACTION_TYPES


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    authentication_classes: (TokenAuthentication, BasicAuthentication)

    def get_queryset(self):
        user = self.request.user
        return_posts = PostSerializer.security_trim_and_eager_load(Post.objects.all(), self.request)
       
        # Apply dynamic filters
        if (self.request.GET.get('loop')):
            groupID = self.request.GET.get('loop')
            # return_posts = return_posts.filter(group__id = groupID).order_by(Coalesce('comments__date_modified','date_modified').desc()).prefetch_related('comments','comments__owner','tags','kudos','photos','short_list_entries','places')
            return_posts = return_posts.filter(group__id = groupID)
            return_posts = return_posts.order_by('-newest_update')

        if (self.request.GET.get('page')):
            page = self.request.GET.get('page')
            paginator = Paginator(return_posts, 15)
            return_posts = paginator.page(page)

        return return_posts

    def create(self, request, *args, **kwargs):
        # Add the current user information to the new post
        data = copy.deepcopy(request.data)
        data.pop('id', None)
        data['owner_id'] =  request.user.id
        
        # Load the data into the serializer
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Ensure the user is an active member of this group
        group_id = serializer.validated_data['group_id']
        if not is_active_member(request.user.id, group_id):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        owner_id = serializer.validated_data['owner_id']
        membership = Membership.objects.get(user__id= owner_id, group__id= group_id)
        membership.user_engagement_section_dismissed = True
        membership.save()
        #Create the new object
        self.perform_create(serializer)
        new_post = Post.objects.get(pk=serializer.data['id'])
        updated_categories = new_post.get_all_categories()
        CategoryStatistics.update_statistics_for_post_change(new_post.group, new_post, None, updated_categories)

        # log the creation event
        SimpleAction.log_simple_action(request.user, 'submit_post')

        #try to send notifications
        try:
            django_rq.enqueue(send_post_notification_with_worker, data=serializer.data, poster=request.user)
        except Exception:
            print('Failed to send new post notifications. The task runner is probably not running')

        # Push the update to connected clients
        try_emit(ACTION_TYPES.POST_DATA_RECEIVED, serializer.data, namespace='/posts')

        # Report success
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # ensure the current user is the owner
        if instance.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Ensure the user is an active member of this group
        if not is_active_member(request.user.id, instance.group.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        original_categories = instance.get_all_categories()
        data = copy.deepcopy(request.data)
        data.pop('owner_id', None)
        data['owner_id'] =  request.user.id

        # # Load the data into the serializer
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_update(serializer)
        except Exception as e:
            raise e

        updated_instance = Post.objects.get(pk=instance.id)
        updated_serializer = self.get_serializer(updated_instance)
        updated_categories = updated_instance.get_all_categories()
        CategoryStatistics.update_statistics_for_post_change(updated_instance.group, updated_instance, original_categories, updated_categories)

        # Push the update to connected clients
        try_emit(ACTION_TYPES.POST_DATA_RECEIVED, updated_serializer.data, namespace='/posts')

        return Response(updated_serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Ensure the user is an active member of this group
        if not is_active_member(request.user.id, instance.group.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Ensure the user is the owner of the post
        if not instance.owner == request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Mark the post as deleted
        instance.is_deleted = True
        instance.date_deleted = datetime.utcnow()
        instance.save()
        all_instance_categories = instance.get_all_categories()
        CategoryStatistics.update_statistics_for_post_change(instance.group, instance, all_instance_categories, None)

        # Push the update to connected clients
        updated_serializer = self.get_serializer(instance)
        try_emit(ACTION_TYPES.POST_DATA_REMOVED, updated_serializer.data, namespace='/posts')
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_post_count(self):
        if(self.GET.get('groupId')):
            group_id = self.GET.get('groupId')
            if(group_id != '0'):
                statistics = CategoryStatistics.objects.get(group__id=group_id,category=None)
                posts_count = statistics.post_count
        
        if(self.GET.get('userId')):
            return_posts = Post.objects.filter(is_deleted=False)
            user_id = self.GET.get('userId')
            return_posts = return_posts.filter(owner__id=user_id)
            posts_count = return_posts.count()

        return HttpResponse(posts_count)


@api_view(['POST'])
def request_multiple_posts(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    user = request.user
    query_set = PostSerializer.security_trim_and_eager_load(Post.objects.all(), request)
    query_set = query_set.filter(pk__in=request_serializer.data['ids']).distinct('id')

    response_serializer = PostSerializer(query_set, many=True)
    return Response(response_serializer.data)
            

@api_view(['POST'])
def get_post_data_newer_than(request):
    data = copy.deepcopy(request.data)
    request_serializer = NewerThanSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    # Nothing newer than one second ago
    # This should ensure that there is no data fetched from the database that
    # has a timestamp that gets missed
    end_date = datetime.now(timezone.utc) - timedelta(seconds=1)
    
    query_set = PostSerializer.security_trim_and_eager_load(Post.objects.all(), request)
    query_set = query_set.filter(newest_update__lte=end_date)

    newer_than = None
    if 'newer_than' in request_serializer.data:
        newer_than = request_serializer.data['newer_than']
        query_set = query_set.filter(newest_update__gt=newer_than)

    results = {
        'posts': query_set,
        'newer_than': newer_than,
        'end_date': end_date
    }

    response_serializer = NewPostDataSerializer(results)
    return Response(response_serializer.data)

    
@api_view(['POST'])
def get_post_data_older_than(request):
    data = copy.deepcopy(request.data)
    request_serializer = OlderThanPostReferenceSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    query_set = PostSerializer.security_trim_and_eager_load(Post.objects.all(), request).order_by('-newest_update')

    group_id = None
    if 'group_id' in request_serializer.data:
        group_id = request_serializer.data['group_id']
        if (group_id != 0):
            query_set = query_set.filter(group_id=group_id)

    user_id = None
    if 'user_id' in request_serializer.data:
        user_id = request_serializer.data['user_id']
        query_set = query_set.filter(owner_id=user_id)

    category_id = None
    if 'category_id' in request_serializer.data:
        category_id = request_serializer.data['category_id']
        categories = Category.objects.get(id=category_id).get_descendants(include_self=True)
        ids_to_check = []
        for category in categories:
            ids_to_check.append(category.id)
        query_set = query_set.filter(categories__id__in=ids_to_check)

    older_than = None
    if 'older_than' in request_serializer.data:
        older_than = request_serializer.data['older_than']
        query_set = query_set.filter(newest_update__lt=older_than)

    posts_older_than_end_date_exist = None
    target_batch_size = None
    end_date = None
    if 'target_batch_size' in request_serializer.data:
        target_batch_size = request_serializer.data['target_batch_size']
        target_end_record = list(query_set[target_batch_size:(target_batch_size + 1)])

        if len(target_end_record) == 1:
            end_date = target_end_record[0].newest_update

            if end_date:
                posts_older_than_end_date_exist = query_set.filter(newest_update__lt=end_date).exists()
                query_set = query_set.filter(newest_update__gte=end_date)

    results = {
        'posts': query_set,
        'user_id': user_id,
        'older_than': older_than,
        'group_id': group_id,
        'category_id': category_id,
        'target_batch_size': target_batch_size,
        'end_date': end_date,
        'posts_older_than_end_date_exist': posts_older_than_end_date_exist
    }

    response_serializer = OlderThanPostReferenceSerializer(results)
    return Response(response_serializer.data)
