from django.contrib.auth.models import User, Group
from django.db.models import Q, Prefetch
from rest_framework import serializers
from dashboard.models import Post, Comment, Category
from users.models import Membership
from api_v1.containers.comment.serializers import CommentSerializer
from api_v1.containers.components.photo_collection.serializers import UsesPhotoCollectionComponent
from api_v1.containers.place.serializers import PlaceSerializer
from api_v1.containers.tag.serializers import TagSerializer
from api_v1.serializers import OwnableDatabaseItemSerializer, CreationDateTrackedSerializer, LastModificationDateTrackedSerializer, OwnableSerializer, RankableModelSerializer, NewerThanSerializer, OlderThanSerializer, EndDateSerializer,TargetBatchSizeSerializer, GroupRelatedSerializer
import api_v1.utilities.image_utilities as image_utils
import api_v1.utilities.category_utilities as category_utilities
import api_v1.utilities.place_utilities as place_utilities
import api_v1.utilities.tag_utilities as tag_utils

class PostSerializer(
  OwnableDatabaseItemSerializer,
  GroupRelatedSerializer,
  CreationDateTrackedSerializer, 
  LastModificationDateTrackedSerializer,
  
  ## Component Mixins
  UsesPhotoCollectionComponent
  ):
  
  newest_update = serializers.DateTimeField(required=False)
  text = serializers.CharField(required=False)
  text_rich_json = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  summary = serializers.CharField(max_length=Post._meta.get_field('summary').max_length,required=False)
  public_comment_count = serializers.IntegerField(min_value=0, required=False, read_only=True)
  private_comment_count = serializers.IntegerField(min_value=0, required=False, read_only=True)

  comment_ids = serializers.SerializerMethodField() # serializers.PrimaryKeyRelatedField(many=True, source="comments", read_only=True)
  
  tags = TagSerializer(many=True, required=False, write_only=True)
  tag_ids = serializers.PrimaryKeyRelatedField(many=True, source="tags", read_only=True)

  category_ids = serializers.PrimaryKeyRelatedField(many=True, source="categories", queryset=Category.objects.all())
  all_category_ids = serializers.SerializerMethodField()
  
  places = PlaceSerializer(many=True, required=False, write_only=True)
  place_ids = serializers.PrimaryKeyRelatedField(many=True, source="places", read_only=True)

  kudos_received_ids = serializers.PrimaryKeyRelatedField(many=True, source="kudos_received", read_only=True)

  def get_all_category_ids(self, obj):
    categories = obj.get_all_categories()
    ids = []
    for category in categories:
      ids.append(category.id)

    return ids


  @staticmethod
  def security_trim_and_eager_load(queryset, request): 

    # Security trim posts and comments result sets
    # Removes appropriate content for inactive users
    user = request.user
    groups = user.groups.all()
    queryset = queryset.filter(group__in=groups, is_deleted=False)
    inactive_memberships = Membership.objects.filter(user__id=user.id,is_active=False,is_removed=False)
    removed_memberships = Membership.objects.filter(user__id=user.id,is_active=False,is_removed=True)
    for membership in removed_memberships:
      queryset = queryset.exclude(
        Q(group__id=membership.group_id) & (
          Q(date_added__gt=membership.date_became_removed)
          | Q(date_modified__gt=membership.date_became_removed)
          )
        )
    for membership in inactive_memberships:
      queryset = queryset.exclude(
        Q(group__id=membership.group_id) & (
          Q(date_added__gt=membership.date_became_inactive)
          | Q(date_modified__gt=membership.date_became_inactive)
          )
        )

    # Return Preped Data set
    return queryset

  def get_comment_ids(self, obj):
    query = obj.comments.filter(is_deleted=False).values('id')
    comments = list(query)
    values = []
    
    for comment in comments:
      values.append(comment['id'])

    return values
    

  def create(self, validated_data):
    try:
      new_post = Post(validated_data)
      new_post.summary = validated_data['summary']
      new_post.text = validated_data['text']
      new_post.text_rich_json = validated_data.get('text_rich_json', None)
      new_post.owner = User.objects.get(pk=validated_data['owner_id'])
      new_post.group = Group.objects.get(pk=validated_data['group_id'])
      new_post.id = None
      new_post.save()

      place_utilities.add_places_to(new_post, validated_data['places'])
      tag_utils.add_tags_to(new_post, validated_data['tags'])
      category_utilities.add_categories_to(new_post, validated_data['categories'])
      image_utils.save_photo_collections(new_post, validated_data['photo_collections'], new_post.group, new_post.owner)
      
      return new_post
    except Exception as e:
      raise e

  def update(self, instance, validated_data):
    try:
      need_to_save = False
      
      if 'summary' in validated_data:
        instance.summary = validated_data.get('summary', instance.summary)
        need_to_save = True
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
        image_utils.save_photo_collections(instance, validated_data['photo_collections'], instance.group, instance.owner)

      updated_instance = Post.objects.get(pk=instance.id)
      return updated_instance
    except Exception as e:
      raise e


class PostReferenceSerializer(OwnableSerializer, RankableModelSerializer):
  id = serializers.IntegerField(required=False, allow_null=True)
  newest_update = serializers.DateTimeField(read_only=True, required=False)

  @staticmethod
  def security_trim_and_eager_load(queryset, request): 
    # Reuse while it's a truly identical implementation
    return PostSerializer.security_trim_and_eager_load(queryset, request)


class NewPostDataSerializer(NewerThanSerializer, EndDateSerializer):
  posts = PostSerializer(many=True, read_only=True)


class OlderThanPostReferenceSerializer(OlderThanSerializer, EndDateSerializer, TargetBatchSizeSerializer):
  group_id = serializers.IntegerField(required=False)
  user_id = serializers.IntegerField(required=False)
  category_id = serializers.IntegerField(required=False)
  posts = PostReferenceSerializer(many=True, read_only=True)
  posts_older_than_end_date_exist = serializers.BooleanField(required=False)
