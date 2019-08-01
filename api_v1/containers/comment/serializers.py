from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers
from dashboard.models import Comment, Post, Category
from users.models import Membership
import api_v1.utilities.image_utilities as image_utils
import api_v1.utilities.category_utilities as category_utilities
import api_v1.utilities.tag_utilities as tag_utils
import api_v1.utilities.place_utilities as place_utilities
from api_v1.serializers import OwnableDatabaseItemSerializer, CreationDateTrackedSerializer, LastModificationDateTrackedSerializer
from api_v1.containers.components.photo_collection.serializers import UsesPhotoCollectionComponent
from api_v1.containers.place.serializers import PlaceSerializer
from api_v1.containers.tag.serializers import TagSerializer
from django.utils import timezone

class CommentSerializer(
  OwnableDatabaseItemSerializer,
  CreationDateTrackedSerializer, 
  LastModificationDateTrackedSerializer,
  
  ## Component Mixins
  UsesPhotoCollectionComponent
  ):

  ##post = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
  summary = serializers.CharField(max_length=Comment._meta.get_field('summary').max_length, required=False)
  text = serializers.CharField(required=False)
  text_rich_json = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  is_private = serializers.BooleanField(required=False)
  
  post = serializers.PrimaryKeyRelatedField(read_only=True)
  post_id = serializers.IntegerField(min_value=0, write_only=True)
  
  tags = TagSerializer(many=True, required=False, write_only=True)
  tag_ids = serializers.PrimaryKeyRelatedField(many=True, source="tags", read_only=True)

  category_ids = serializers.PrimaryKeyRelatedField(many=True, source="categories", queryset=Category.objects.all())

  places = PlaceSerializer(many=True, required=False, write_only=True)
  place_ids = serializers.PrimaryKeyRelatedField(many=True, source="places", read_only=True)
  
  kudos_received_ids = serializers.PrimaryKeyRelatedField(many=True, source="kudos_received", read_only=True)

  @staticmethod
  def security_trim_and_eager_load(queryset, request):
    
    # Security trim posts and comments result sets
    # Removes appropriate content for inactive users
    user = request.user
    groups = user.groups.all()
    group_posts = Post.objects.filter(group__in=groups).distinct()
    queryset = queryset.filter(post__in=group_posts, is_deleted=False).distinct()
    inactive_memberships = Membership.objects.filter(user__id=user.id,is_active=False,is_removed=False)
    removed_memberships = Membership.objects.filter(user__id=user.id,is_active=False,is_removed=True)
    for membership in removed_memberships:
      queryset = queryset.exclude(
        Q(post__group__id=membership.group_id) & (
          Q(date_added__gt=membership.date_became_removed)
          | Q(date_modified__gt=membership.date_became_removed)
          )
        )
    for membership in inactive_memberships:
      queryset = queryset.exclude(
        Q(post__group__id=membership.group_id) & (
          Q(date_added__gt=membership.date_became_inactive)
          | Q(date_modified__gt=membership.date_became_inactive)
          )
        )

    # Eager load related entities
    queryset = queryset.prefetch_related(
      'owner',
      'kudos',
      'tags',
      'places') 

    # Return Preped Data set
    return queryset

  def create(self, validated_data):
    try:
      new_comment = Comment(validated_data)
      new_comment.text = validated_data['text']
      new_comment.text_rich_json = validated_data['text_rich_json']
      new_comment.owner = User.objects.get(pk=validated_data['owner_id'])
      new_comment.post = Post.objects.get(pk=validated_data['post_id'])
      new_comment.post_id = validated_data['post_id']
      new_comment.id = None
      new_comment.save()
      
      place_utilities.add_places_to(new_comment, validated_data['places'])
      tag_utils.add_tags_to(new_comment, validated_data['tags'])
      category_utilities.add_categories_to(new_comment, validated_data['categories'])
      image_utils.save_photo_collections(new_comment, validated_data['photo_collections'], new_comment.post.group, new_comment.owner)

      return new_comment
    except Exception as e:
      raise e

  def update(self, instance, validated_data):
    try:
      need_to_save = False
      if 'text' in validated_data:
        instance.text = validated_data.get('text', instance.text)
        need_to_save = True
      if 'text_rich_json' in validated_data:
        instance.text_rich_json = validated_data.get('text_rich_json', instance.text_rich_json)
        need_to_save = True

      if need_to_save:
        instance.save()

      if 'places' in validated_data:
        place_utilities.delete_removed_places_from(instance, validated_data['places'])
        place_utilities.add_places_to(instance, validated_data['places'])

      if 'tags' in validated_data:
        tag_utils.delete_removed_tags_from(instance, validated_data['tags'])
        tag_utils.add_tags_to(instance, validated_data['tags'])

      if 'categories' in validated_data:
        category_utilities.delete_removed_categories_from(instance, validated_data['categories'])
        category_utilities.add_categories_to(instance, validated_data['categories'])

      if 'photo_collections' in validated_data:
        image_utils.save_photo_collections(instance, validated_data['photo_collections'], instance.post.group, instance.owner)

      updated_instance = Comment.objects.get(pk=instance.id)
      return updated_instance
    except Exception as e:
      raise e