from users.models import Membership

def is_active_member(user_id, loop_id):
  return Membership.objects.filter(group__id=loop_id,user__id=user_id,is_active=True).exists()


