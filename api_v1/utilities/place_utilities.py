import dashboard.models as models

def get_or_create_place(serialized_data):
  place = None
  place_id = None

  if 'id' in serialized_data:
    place_id = serialized_data['id']

  if place_id:
    place = models.Place.objects.get(pk=place_id)
  else:
    place_name = serialized_data['name']
    place_query = models.Place.objects.filter(name=place_name).order_by('name').distinct('name')

    if place_query.exists():
      place = place_query.first()

  if not place:
    place = models.Place(serialized_data)
    place.name = place_name
    place.is_user_generated = serialized_data['is_user_generated']
    place.id = None
    place.save()

  return place

def get_place_name_for(serialized_data):
  if 'name' in serialized_data:
    return serialized_data['name']
  elif 'id' in serialized_data:
    place_id = serialized_data['id']
    place = get_or_create_place(serialized_data)
    return place.name

  raise Exception('Failed to get place name property')

def add_places_to(thing, validated_place_data):
  need_to_save = False
  
  for serialized_place in validated_place_data:
    place = get_or_create_place(serialized_place)
    if not thing.places.filter(pk=place.id).exists():
      thing.places.add(place)
      need_to_save = True

  if need_to_save:
    thing.save()

def delete_removed_places_from(thing, validated_place_data):
  need_to_save = False

  for existing_place in thing.places.all():
    need_to_remove = True

    for serialized_place in validated_place_data:
      place_name = get_place_name_for(serialized_place)
      if existing_place.name == place_name:
        need_to_remove = False
        break

    if need_to_remove:
      thing.places.remove(existing_place)
      need_to_save = True

  if need_to_save:
    thing.save()