from django.contrib.auth.models import User, Group
import users.models as user_models


def is_user_member_of_group(user_id, group_id):
  membership = user_models.Membership.objects.filter(
    is_active=True,
    user_id=user_id,
    group__id=group_id
  )

  is_group_member = membership.exists()
  return is_group_member

def is_user_admin_of_group(user_id, group_id):
  admin_membership = user_models.Membership.objects.filter(
    is_active=True,
    user_id=user_id,
    group__id=group_id,
    is_coordinator=True
  )

  is_group_admin = admin_membership.exists()
  return is_group_admin
