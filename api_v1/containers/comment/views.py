import copy, logging
from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from actions.models import SimpleAction, ReceivedCommentToPost
from dashboard.models import Comment, Post, CategoryStatistics
from api_v1.containers.comment.serializers import CommentSerializer
from api_v1.containers.loop.membership.utilities import is_active_member
from api_v1.containers.post.serializers import PostSerializer
from datetime import datetime
from api_v1.serializers import BatchRequestSerializer
from api_v1.notification_handlers.notification_handler import send_comment_notification_with_worker
from api_v1.utilities.socketio_utilities import try_emit
import api_v1.utilities.socketio_actions as ACTION_TYPES
import django_rq

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        filtered_comments = CommentSerializer.security_trim_and_eager_load(Comment.objects.all(), self.request)
        return filtered_comments

    def create(self, request, *args, **kwargs):
        data = copy.deepcopy(request.data)
        data.pop('id', None)
        data['owner_id'] = request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Ensure the user is an active member of this group
        post = Post.objects.get(pk=serializer.validated_data['post_id'])
        if not is_active_member(request.user.id, post.group.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        original_categories = post.get_all_categories()
        self.perform_create(serializer)
        created_comment = Comment.objects.get(pk=serializer.data['id'])
        Post.objects.filter(pk=created_comment.post_id).update(newest_update=created_comment.date_modified)
        post = Post.objects.get(pk=created_comment.post_id)
        updated_categories = post.get_all_categories()
        CategoryStatistics.update_statistics_for_post_change(post.group, post, original_categories, updated_categories)

        # log the creation event
        SimpleAction.log_simple_action(request.user, 'submit_comment')
        ReceivedCommentToPost.objects.create(user=request.user, comment=created_comment, is_notified=(post.owner != request.user))

        # Send notifications
        try:
            post_id = serializer.validated_data['post_id']
            django_rq.enqueue(send_comment_notification_with_worker, data=serializer.data, commenter=request.user, post_id=post_id)
        except Exception:
            print('Failed to send notifications. The task runner is probably not running')

        # Push the update to connected clients
        updated_post = Post.objects.get(pk=post.id)
        post_serializer = PostSerializer(updated_post)
        try_emit(ACTION_TYPES.POST_DATA_RECEIVED, post_serializer.data, '/posts')


        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # ensure the current user is the owner
        if instance.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Ensure the user is an active member of this group
        if not is_active_member(request.user.id, instance.post.group.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        parent_post = Post.objects.get(pk=instance.post.id)
        original_categories = parent_post.get_all_categories()
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

        # Update the newest update field
        updated_instance = Comment.objects.get(pk=instance.id)
        Post.objects.filter(pk=updated_instance.post_id).update(newest_update=updated_instance.date_modified)
        updated_post = Post.objects.get(pk=updated_instance.post.id)
        updated_categories = updated_post.get_all_categories()
        CategoryStatistics.update_statistics_for_post_change(updated_post.group, updated_post, original_categories, updated_categories)
        
        # Push the update to connected clients
        updated_post = Post.objects.get(pk=updated_instance.post_id)
        post_serializer = PostSerializer(updated_post)
        try_emit(ACTION_TYPES.POST_DATA_RECEIVED, post_serializer.data, '/posts')

        # Return the saved comment        
        updated_serializer = self.get_serializer(updated_instance)
        return Response(updated_serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Ensure the user is an active member of this group
        if not is_active_member(request.user.id, instance.post.group.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Ensure the user is the owner of the post
        if not instance.owner == request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Mark the comment as deleted
        parent_post = Post.objects.get(pk=instance.post.id)
        original_categories = parent_post.get_all_categories()
        updated_time_stamp = datetime.utcnow()
        instance.is_deleted = True
        instance.date_deleted = updated_time_stamp
        instance.save()

        post = Post.objects.get(id=instance.post.id)
        post.newest_update = updated_time_stamp
        post.save()

        # Push the update to connected clients
        updated_post = Post.objects.get(pk=post.id)
        updated_categories = updated_post.get_all_categories()
        CategoryStatistics.update_statistics_for_post_change(updated_post.group, updated_post, original_categories, updated_categories)
        post_serializer = PostSerializer(updated_post)
        try_emit(ACTION_TYPES.POST_DATA_RECEIVED, post_serializer.data, '/posts')

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_comment_count(self):
        comments = Comment.objects.all()

        if(self.GET.get('userId')):
            user_id = self.GET.get('userId')
            comments = comments.filter(owner__id=user_id)
            
        comments_count = comments.count()

        return HttpResponse(comments_count)

@api_view(['POST'])
def request_multiple_comments(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    user = request.user
    query_set = CommentSerializer.security_trim_and_eager_load(Comment.objects.all(), request)
    query_set = query_set.filter(pk__in=request_serializer.data['ids']).distinct('id')

    response_serializer = CommentSerializer(query_set, many=True)
    return Response(response_serializer.data)

