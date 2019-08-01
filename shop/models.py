from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import ArrayField
from django.contrib import admin

# Create your models here.
class Order(models.Model):
  order_id = models.CharField(max_length=50, primary_key=True, unique=True, editable=False)
  user = models.ForeignKey(User)
  amount = models.IntegerField()
  amount_returned = models.IntegerField(blank=True, null=True)
  application = models.CharField(max_length=100, blank=True, null=True),
  application_fee = models.IntegerField(blank=True, null=True)
  charge = models.CharField(max_length=50, blank=True, null=True),
  currency = models.CharField(max_length=3),
  email = models.EmailField()
  status = models.CharField(max_length=10)
  created = models.DateTimeField()
  updated = models.DateTimeField()


class OrderStatusTransition(models.Model):
  order = models.ForeignKey(Order, on_delete=models.deletion.CASCADE, related_name="status_transitions")
  status = models.CharField(max_length=10)
  created = models.DateTimeField()


class OrderItem(models.Model):
  order = models.ForeignKey(Order, on_delete=models.deletion.CASCADE, related_name="items")
  amount = models.IntegerField(blank=True, null=True)
  currency = models.CharField(max_length=3),
  description = models.CharField(max_length=200, blank=True, null=True)
  parent = models.CharField(max_length=50, blank=True, null=True)
  quantity = models.IntegerField(blank=True, null=True)
  item_type = models.CharField(max_length=10)

class Collection(models.Model):
  title = models.CharField(max_length=80)
  description = models.CharField(max_length=500)
  artist = models.CharField(max_length=80)
  photo = models.ImageField()
  kudos_ids = ArrayField(models.CharField(max_length=80))

  def __str__(self):
    """Return a string representation of the model."""
    return self.title
    
class Kudos(models.Model):
  class Meta:
    verbose_name_plural = "kudos"

  sticker = models.ImageField()
  title = models.CharField(max_length=80)
  description = models.CharField(max_length=500)
  artist = models.CharField(max_length=80)
  limited_count = models.IntegerField(blank=True, null=True)
  number_sold = models.IntegerField(default=0)

  def __str__(self):
    """Return a string representation of the model."""
    return self.title

class CatalogItem(models.Model):
  sku = models.CharField(max_length=80)
  kudos = models.ManyToManyField(Kudos, blank=True)
  collection = models.ManyToManyField(Collection, blank=True)
  price = models.IntegerField()
  title = models.CharField(max_length=80)
  description = models.CharField(max_length=500)
  start_date = models.DateField()
  end_date = models.DateField(blank=True, null=True)

  def __str__(self):
    """Return a string representation of the model."""
    return self.title

class KudosAvailable(models.Model):
  user = models.ForeignKey(User, related_name='kudos_available')
  kudos = models.ForeignKey(Kudos)
  edition_number = models.IntegerField()
  order = models.ForeignKey(Order)

class KudosGiven(models.Model):
  giver = models.ForeignKey(User, related_name='kudos_given')
  receiver = models.ForeignKey(User, related_name='kudos_received')
  kudos = models.ForeignKey(Kudos)
  note = models.CharField(max_length=500)
  edition_number = models.IntegerField()
  order = models.ForeignKey(Order)

  """ A component can be associated to any model
  Primarily this will be used for posts and comments
  Using generic relations so this class can reference both (any)
  See https://simpleisbetterthancomplex.com/tutorial/2016/10/13/how-to-use-generic-relations.html
  and https://docs.djangoproject.com/en/1.11/ref/contrib/contenttypes/   """
  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')