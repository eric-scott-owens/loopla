import copy, operator
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.http import JsonResponse
from google.cloud import language
from google.cloud.language import enums, types
from dashboard.models import Tag, Post, Category
from api_v1.containers.tag.serializers import TagSerializer
from api_v1.serializers import BatchRequestSerializer
from api_v1.utilities.tag_utilities import get_or_create_tag

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    http_method_names = ['get', 'head', 'post']

    def get_queryset(self):
        return_tags = Tag.objects.all()
        if(self.request.GET.get('name')):
            tagName = self.request.GET.get('name')
            return_tag = return_tags.filter(name__iexact=tagName).order_by('name').distinct('name')
            return return_tag
        return return_tags

    def create(self, request, *args, **kwargs):
        data = copy.deepcopy(request.data)
        data.pop('id', None)

        # Load the data into the serializer
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        #Create the new object
        self.perform_create(serializer)

        # Report success
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_top_tags(self):
        if(self.GET.get('groupId')):
            group_id = self.GET.get('groupId')
            all_posts = Post.objects.filter(group=group_id)
            all_tag_list = {}
            for post in all_posts:
                for tag in post.tags.all():
                    if (tag.id not in all_tag_list):
                        all_tag_list[tag.id] = 0
                    all_tag_list[tag.id] += 1
        
            top_tags = {}
            top_five = dict(sorted(all_tag_list.items(), key=operator.itemgetter(1), reverse=True)[:5])

            for tag, count in top_five.items():
                top_tag = {}
                top_tag['id'] = tag
                top_tag['is_user_generated'] = Tag.objects.get(id=tag).is_user_generated
                top_tag['count'] = count
                top_tags[top_tag['id']] = top_tag

            return JsonResponse({
                'top_tags': top_tags
            })


@api_view(['POST'])
def request_multiple_tags(request):
    data = copy.deepcopy(request.data)
    request_serializer = BatchRequestSerializer(data=data)
    request_serializer.is_valid(raise_exception=True)

    query_set = Tag.objects.filter(pk__in=request_serializer.data['ids']).order_by('id').distinct('id')

    response_serializer = TagSerializer(query_set, many=True)
    return Response(response_serializer.data)


@api_view(['POST'])
def get_suggested_tags_and_categories(request):
    # Build the text to send to Google to be classified
    text = ''
    summary = ''

    if 'summary' in request.data:
        summary = request.data['summary']

    if 'text' in request.data:
        text = request.data['text']

    classification_text = ''
    
    if summary and text:
        classification_text = "Subject: " + summary + ". About: " + text
    elif summary:
        classification_text = "subject: " + summary
    elif text:
        classification_text = "About: " + text
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    while len(classification_text) < 20:
        classification_text = '%s %s' % (classification_text, classification_text)

    client = language.LanguageServiceClient()
    document = types.Document(
        content = classification_text,
        type = enums.Document.Type.PLAIN_TEXT
    )

    tag_ids = []
    category_ids = []

    try:
        response = client.classify_text(document)
        categories = response.categories

        for c in categories:
            if c.confidence > 0.5:
                tmp_text = c.name.split('/')[-1]
                # SWITCH FROM TAG TO NEW CATEGORY
                tag = get_or_create_tag({ 'name': tmp_text.lower(), 'model_type':'Tag' })
                if tag.id not in tag_ids:
                    tag_ids.append(tag.id)
                
                categories = Category.objects.filter(tag__id=tag.id)
                for category in categories:
                    if category.id not in category_ids:
                        category_ids.append(category.id)

    except BaseException as e:
        print("Cannot get categories: ", str(e))

    values = {
        'tag_ids': tag_ids,
        'category_ids': category_ids
    }

    return JsonResponse(values)

