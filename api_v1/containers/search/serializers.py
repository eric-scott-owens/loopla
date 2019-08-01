from rest_framework import serializers
from api_v1.containers.post.serializers import PostReferenceSerializer
from api_v1.containers.place.serializers import MentionedPlaceReferenceSerializer
from api_v1.containers.tag.serializers import TagReferenceSerializer

class SearchSerializer(serializers.Serializer):
  posts = PostReferenceSerializer(many=True, read_only=True)
  
  full_text_query = serializers.CharField(max_length=80, required=False, allow_null=True, write_only=True)
  tag_name = serializers.CharField(max_length=80, required=False, allow_null=True, write_only=True)
  place_id = serializers.IntegerField(required=False, allow_null=True, write_only=True)

  def validate(self, data):
    if (
      (not 'full_text_query' in data or data['full_text_query'] is None) and 
      (not 'tag_name' in data or data['tag_name'] is None) and 
      (not 'place_id' in data or data['place_id'] is None)
    ):
      raise serializers.ValidationError('No search parameters provided')

    return data

class RelatedPlacesSerializer(serializers.Serializer):
  related_places = MentionedPlaceReferenceSerializer(many=True, read_only=True)


class RelatedTagsSerializer(serializers.Serializer):
  related_tags = TagReferenceSerializer(many=True, read_only=True)