
import dashboard.models as models

def get_or_create_tag(serialized_data):
  tag = None
  model = None
  
  tag_model = serialized_data['model_type']
  if tag_model == 'Tag':
    model = models.Tag
  else:
    raise Exception('Invalid tag type')

  tag_id = None
  if 'id' in serialized_data:
    tag_id = serialized_data['id']

  if tag_id:
    tag = model.objects.get(pk=tag_id)
  else:
    tag_name = serialized_data['name']
    tag_query = model.objects.filter(name=tag_name).order_by('name').distinct('name')
    
    if tag_query.exists():
      tag = tag_query.first()
    
  if not tag:
    tag = model(serialized_data)
    tag.name = tag_name
    tag.id = None
    tag.save()
    
  return tag

def get_tag_name_for(serialized_data): 
  if 'name' in serialized_data:
    return serialized_data['name']
  elif 'id' in serialized_data:
    tag_id = serialized_data['id']
    tag_model = serialized_data['model_type']

    if tag_model == 'Tag':
      tag = get_or_create_tag(serialized_data)
      return tag.name

  raise Exception('Failed to get tag name property')

def add_tags_to(thing, validated_tag_data):

  need_to_save = False

  for serialized_tag in validated_tag_data:
    tag_model = serialized_tag['model_type']
    
    if tag_model == 'Tag':
      tag = get_or_create_tag(serialized_tag)
      if not thing.tags.filter(pk=tag.id).exists():
        thing.tags.add(tag)
        need_to_save = True
    
  if need_to_save:
    thing.save()


def delete_removed_tags_from(thing, validated_tag_data):

  need_to_save = False

  # Remove appropriate tags
  for existing_tag in thing.tags.all():
    need_to_remove = True
    
    for serialized_tag in validated_tag_data:
      tag_model = serialized_tag['model_type']
      tag_name = get_tag_name_for(serialized_tag)

      if tag_model == 'Tag' and existing_tag.name == tag_name:
        need_to_remove = False
        break

    if need_to_remove:
      thing.tags.remove(existing_tag)
      need_to_save = True
  
  if need_to_save:
    thing.save()