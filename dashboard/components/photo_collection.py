from django.contrib.auth.models import User, Group
from django.conf import settings
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill, ResizeToFit, Transpose
from storages.backends.s3boto3 import S3Boto3Storage

from dashboard.components.generic_component import GenericComponent

# Photo Collection Components
class PhotoCollectionComponent(GenericComponent):
  ## gets everything it needs from GenericComponent
  pass

class Photo(models.Model):
  owner = models.ForeignKey(User, on_delete=models.CASCADE)
  group = models.ForeignKey(Group, on_delete=models.CASCADE)
  date_added = models.DateTimeField(auto_now_add=True)
  caption = models.CharField(max_length=60, blank=True)

  image_width = models.PositiveIntegerField()
  image_height = models.PositiveIntegerField()
  image = ProcessedImageField(upload_to='images',
                            processors=[Transpose()],
                            storage=S3Boto3Storage(bucket=settings.AWS_SECURE_STORAGE_BUCKET_NAME))

  thumbnail = ProcessedImageField(
                             upload_to='image_thumbnails',
                             processors=[Transpose(), ResizeToFit(400, 400)],
                             storage=S3Boto3Storage(bucket=settings.AWS_SECURE_STORAGE_BUCKET_NAME))

  def __str__(self):
    return self.image.name

class PhotoCollectionPhoto(models.Model):
  photo_collection = models.ForeignKey(PhotoCollectionComponent, on_delete=models.CASCADE, related_name="photo_collection_photos")
  photo = models.ForeignKey(Photo, on_delete=models.CASCADE)
  ordering_index = models.PositiveIntegerField()
