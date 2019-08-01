from django import template

register = template.Library()

@register.filter(name='get_membership')
def get_membership(membership, user_id):
    return membership.get(user=user_id)
