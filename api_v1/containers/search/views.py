import copy
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dashboard.models import Post, Place, Tag, Comment
from api_v1.containers.post.serializers import PostReferenceSerializer
from api_v1.containers.search.serializers import SearchSerializer, RelatedPlacesSerializer, RelatedTagsSerializer
from api_v1.serializers import BatchRequestSerializer


@api_view(['GET'])
def search_view(request, format=None):
    query = request.GET.get('query', None)
    tag_name = request.GET.get('tag', None)
    place_id = request.GET.get('place', None)
    search_parameters = {
        "full_text_query": query,
        "tag_name": tag_name,
        "place_id": place_id
    }

    # Validate incoming data using SearchSerializer
    serializer = SearchSerializer(data=search_parameters)
    serializer.is_valid(raise_exception=True)
    validated_search_parameters = serializer.validated_data

    # Get our starting filter data
    search_posts = PostReferenceSerializer.security_trim_and_eager_load(Post.objects.all(), request)

    # Filter by tag if provided
    if tag_name:
        search_posts = search_posts.filter(
            Q(tags__name__iexact=validated_search_parameters['tag_name']) | 
            Q(comments__tags__name__iexact=validated_search_parameters['tag_name']))
    
    # Filter by place id if provided
    if place_id:
        search_posts = search_posts.filter(
            Q(places__id=validated_search_parameters['place_id']) | 
            Q(comments__places__id=validated_search_parameters['place_id']))

    # Filter by query terms
    if query:
        tokens = validated_search_parameters['full_text_query'].split()
        search_query = None
        for token in tokens:
            if search_query == None:
                search_query = SearchQuery(token)
            else:
                search_query = search_query | SearchQuery(token)
        search_vector = SearchVector('summary', 'text', 'tags__name', 'comments__summary', 'comments__text', 'comments__tags__name', 'owner__first_name', 'owner__last_name', 'owner__person__middle_name')
        search_posts = search_posts.annotate(rank=SearchRank(search_vector, search_query)).filter(rank__gt=0)

        # Sort the matching posts by id so that we can make them distinct by id
        # Also limit the data returned to only that needed by our serializer
        search_posts = search_posts.order_by('-rank', 'id').values('rank', 'id', 'owner_id', 'newest_update').distinct()
        results = list(search_posts)
    else:
        search_posts = search_posts.order_by('-id').values('id', 'owner_id', 'newest_update').distinct('id')
        results = list(search_posts)
        for result in results:
            result['rank'] = 0.0

    # Fix multiple ranked results due to Many-to-Many relationships in SearchVectors (ie: 'tags__name')
    distinct_results = {}
    for result in results:
        id = str(result['id'])
        rank = result['rank']
        if not id in distinct_results:
            distinct_results[id] = result
        elif distinct_results[id]['rank'] < rank:
            distinct_results[id]['rank'] = rank

    results_list = list(distinct_results.values())

    search_results = {
        "posts" : results_list,
    }

    serializer = SearchSerializer(search_results)
    return Response(serializer.data)
 

# Accepts a collection of post IDS and returns all the places associated with those posts
# or their child comments
@api_view(['POST'])
def query_post_related_places(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    post_ids = request_serializer.data['ids']
    comment_ids = Comment.objects.filter(post__id__in=post_ids).values_list('id', flat=True)
    post_places = list(Post.places.through.objects.filter(post__id__in=post_ids).values('place_id', 'post__owner_id'))
    comment_places = list(Comment.places.through.objects.filter(comment__id__in=comment_ids).values('place_id', 'comment__owner_id'))
    
    related_places_dict = {}

    # Deduplicate results
    for place_data in post_places:
        key = str(place_data['place_id'])
        if not key in related_places_dict:
            related_places_dict[key] = { 'id': place_data['place_id'], 'owner_ids': { }}
            related_places_dict[key]['owner_ids'][str(place_data['post__owner_id'])] = True
        else:
            related_places_dict[key]['owner_ids'][str(place_data['post__owner_id'])] = True
    
    for place_data in comment_places:
        key = str(place_data['place_id'])
        if not key in related_places_dict:
            related_places_dict[key] = { 'id': place_data['place_id'], 'owner_ids': { }}
            related_places_dict[key]['owner_ids'][str(place_data['comment__owner_id'])] = True
        else:
            related_places_dict[key]['owner_ids'][str(place_data['comment__owner_id'])] = True

    related_places = related_places_dict.values()
    for related_place in related_places:
        related_place['owner_ids'] = related_place['owner_ids'].keys()
    
    results = {
        "related_places": related_places,
    }

    serializer = RelatedPlacesSerializer(results)
    return Response(serializer.data)


# Accepts a collection of post IDS and returns all the tags associated with those posts
# or their child comments
@api_view(['POST'])
def query_post_related_tags(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    post_ids = request_serializer.data['ids']
    comment_ids = Comment.objects.filter(post__id__in=post_ids).values_list('id', flat=True)

    # Inspired by: https://www.peterbe.com/plog/efficient-m2m-django-rest-framework
    post_tag_values = list(Post.tags.through.objects.filter(post__id__in=post_ids).values('tag_id'))
    comment_tag_values = list(Comment.tags.through.objects.filter(comment__id__in=comment_ids).values('tag_id'))
    # related_tags = Tag.objects.filter(Q(pk__in=(post_tag_ids)) | Q(pk__in=(comment_tag_ids)))
    
    related_tags = []
    for tag_values in post_tag_values:
        tag = type('', (), {})()
        tag.id = tag_values['tag_id']
        related_tags.append(tag)
    for tag_values in comment_tag_values:
        tag = type('', (), {})()
        tag.id = tag_values['tag_id']
        related_tags.append(tag)

    results = {
        "related_tags": related_tags,
    }

    serializer = RelatedTagsSerializer(results)
    return Response(serializer.data)

