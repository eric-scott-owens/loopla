from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.contrib.auth.models import User, Group

class GenericComponent(models.Model):
  class Meta:
    abstract = True

  """ A component can be associated to any model
  Primarily this will be used for posts and comments
  Using generic relations so this class can reference both (any)
  See https://simpleisbetterthancomplex.com/tutorial/2016/10/13/how-to-use-generic-relations.html
  and https://docs.djangoproject.com/en/1.11/ref/contrib/contenttypes/   """
  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')
  ordering_index = models.PositiveIntegerField()

  group = models.ForeignKey(Group, on_delete=models.CASCADE)
  owner = models.ForeignKey(User, on_delete=models.CASCADE)