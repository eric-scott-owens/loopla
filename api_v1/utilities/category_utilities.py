from dashboard.models import Category

def add_categories_to(thing, validated_category_data):

  need_to_save = False

  for category in validated_category_data:
    if not thing.categories.filter(pk=category.id).exists():
      thing.categories.add(category)
      need_to_save = True
    
  if need_to_save:
    thing.save()


def delete_removed_categories_from(thing, validated_category_data):

  need_to_save = False

  # Remove appropriate categories
  for existing_category in thing.categories.all():
    need_to_remove = True
    
    for category in validated_category_data:
      if existing_category.id == category.id:
        need_to_remove = False
        break

    if need_to_remove:
      thing.categories.remove(existing_category)
      need_to_save = True
  
  if need_to_save:
    thing.save()