from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from api_v1.containers.shop.catalog.serializers import CatalogItemSerializer, CollectionSerializer, KudosSerializer
from shop.models import CatalogItem, Kudos, Collection

class CatalogItemViewSet(viewsets.ModelViewSet):
  serializer_class = CatalogItemSerializer
  authentication_classes: (TokenAuthentication, BasicAuthentication)

  def get_queryset(self):
    current_date = datetime.now().date()

    return_items = CatalogItem.objects.filter(start_date__lt=current_date, end_date__gt=current_date)
    return return_items