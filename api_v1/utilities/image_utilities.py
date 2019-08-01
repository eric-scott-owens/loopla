import base64
from datetime import datetime
import os
from PIL import ExifTags
from django.core.files.base import ContentFile
import dashboard.models as models
from dashboard.components.photo_collection import PhotoCollectionComponent, PhotoCollectionPhoto, Photo


def create_or_update_photo_collection(thing, updated_photo_collection_data, group, owner):
  """ Fully creates, or updates the data in a photo collection component based on incoming data

  Args:
    thing:  The related database object for which photo collection is being created, or updated 
            This will typically be a post or a comment. 
    photo_collections: The entirety of photo collection information to be applied to the thing.
    group:  The group within which this thing exists. This will be used to conveniently apply 
            permissions to the contents of the photo collection. 
    owner:  The person who owns the thing. This will be used to conveniently apply permissions 
            to the contents of the photo collection. 

  Returns:  The created, or updated, instance of the database object for the photo collection.
  
  """

  # Get the photo collection object to save to the database
  need_to_save_collection = False
  photo_collection_component = None
  if 'id' in updated_photo_collection_data:
    # We're modifying an existing one
    photo_collection_component = PhotoCollectionComponent.objects.get(id=updated_photo_collection_data['id'])
  else:
    # We're creating a new one
    photo_collection_component = PhotoCollectionComponent(content_object=thing, group=group, owner=owner)
    need_to_save_collection = True
  
  # Update the ordering_index
  if photo_collection_component.ordering_index != updated_photo_collection_data['ordering_index']:
    photo_collection_component.ordering_index = updated_photo_collection_data['ordering_index']
    need_to_save_collection = True
  
  # If we've made any changes to the photo collection object, it's time to save
  if need_to_save_collection:
    photo_collection_component.save()

  return photo_collection_component


def create_or_update_photo_collection_photo(photo_collection_component, updated_photo_collection_photo_data, group, owner):
  photo_collection_photo = None

  if 'id' in updated_photo_collection_photo_data:
    photo_collection_photo = PhotoCollectionPhoto.objects.get(id=updated_photo_collection_photo_data['id'])

    # update the ordering index here
    if 'ordering_index' in updated_photo_collection_photo_data:
      if photo_collection_photo.ordering_index != updated_photo_collection_photo_data['ordering_index']:
        photo_collection_photo.ordering_index = updated_photo_collection_photo_data['ordering_index']
        photo_collection_photo.save()
    
    if 'photo' in updated_photo_collection_photo_data:
      photo_data = updated_photo_collection_photo_data['photo']
      photo = photo_collection_photo.photo
      
      if 'caption' in photo_data and photo.caption != photo_data['caption']:
        photo.caption = photo_data['caption']
        photo.save()

  else:
    # Create photo object 
    photo_data = updated_photo_collection_photo_data['photo']

    photo = Photo(owner=owner, group=group)
    
    if 'caption' in photo_data:
      photo.caption = photo_data['caption']

    image_upload = photo_data['image_upload']

    # set Height and width
    try:
      for orientation in ExifTags.TAGS.keys():
        if ExifTags.TAGS[orientation]=='Orientation':
            break

      exif=dict(image_upload.image._getexif().items())
      is_height_width_flipped = (exif[orientation] == 6 or exif[orientation] == 8)
    
      if is_height_width_flipped:
        photo.image_width = image_upload.image.height
        photo.image_height = image_upload.image.width
      else:
        photo.image_width = image_upload.image.width
        photo.image_height = image_upload.image.height

    # Default height and width to image properties
    except(AttributeError, KeyError, IndexError):
      # image doesn't have getexif
      photo.image_width = image_upload.image.width
      photo.image_height = image_upload.image.height

    photo.image = image_upload
    photo.save()

    thumbnail_file = ContentFile(photo.image.read())
    thumbnail_file.name = os.path.split(photo.image.file.name)[-1]
    photo.thumbnail = thumbnail_file
    photo.save()

    photo_collection_photo = PhotoCollectionPhoto(
      photo=photo, 
      photo_collection=photo_collection_component, 
      ordering_index = updated_photo_collection_photo_data['ordering_index'])
    photo_collection_photo.save()

  return photo_collection_photo

def save_photo_collections(thing, photo_collections, group, owner):
  """ Saves updated photo collection data into a related object

  Args:
    thing:  The related database object for which photo collections are being created, updated 
            or deleted. This will typically be a post or a comment. 
    photo_collections: The entirety of photo collection information to be applied to the thing.
    group:  The group within which this thing exists. This will be used to conveniently apply 
            permissions to the contents of the photo collections. 
    owner:  The person who owns the thing. This will be used to conveniently apply permissions 
            to the contents of the photo collections. 

  Returns:  Updated instance of the database object having all provided changes to the photo
            collections applied.
  """


  photo_collection_ids = []
  # Create / update all photo collections returned from the client
  for updated_photo_collection in photo_collections:
    photo_collection_component = create_or_update_photo_collection(thing, updated_photo_collection, group, owner)
    photo_collection_ids.append(photo_collection_component.id)

    # Now, update ach photo collection photo as needed
    if 'photo_collection_photos' in updated_photo_collection:
      photo_collection_photos_ids = []
      for updated_photo_collection_photo_data in updated_photo_collection['photo_collection_photos']:
        photo_collection_photo = create_or_update_photo_collection_photo(photo_collection_component, updated_photo_collection_photo_data, group, owner)
        photo_collection_photos_ids.append(photo_collection_photo.id)

      # Remove any removed photos
      photos_to_remove = photo_collection_component.photo_collection_photos.exclude(photo_collection=photo_collection_component ,id__in=photo_collection_photos_ids)
      for photo_collection_photo in photos_to_remove:
        photo_collection_photo.delete()

  # Remove any removed photo collections
  photo_collections_to_remove = thing.photo_collections.exclude(id__in=photo_collection_ids)
  for photo_collection in photo_collections_to_remove:
    photo_collection.delete()
      
