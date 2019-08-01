import copy, operator
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.http import JsonResponse
from google.cloud import language
from google.cloud.language import enums, types
from dashboard.models import Category, Post, CategoryStatistics
from api_v1.containers.category.serializers import CategorySerializer, CategoryStatisticsSerializer
from api_v1.serializers import BatchRequestSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    http_method_names = ['get', 'head', 'post']

    def get_queryset(self):
      return_categories = Category.objects.all().order_by('level')

      if(self.request.GET.get('id')):
        parent_id = self.request.GET.get('id')
        return_categories = return_categories.filter(parent_id=parent_id)
        return return_categories

      return return_categories

class CategoryStatisticsViewSet(viewsets.ModelViewSet):
  serializer_class = CategoryStatisticsSerializer
  http_method_names = ['get', 'head', 'post']

  def get_queryset(self): 
    user = self.request.user
    groups = user.groups.all()
    return_statistics = CategoryStatistics.objects.filter(group__in=groups)

    if(self.request.GET.get('category_id')):
      category_id = self.request.GET.get('category_id')
      return_statistics = return_statistics.filter(category_id=category_id)
    
    if(self.request.GET.get('group_id')):
      group_id = self.request.GET.get('group_id')
      return_statistics = return_statistics.filter(group_id=group_id)

    return return_statistics
