from django import template

register = template.Library()

@register.filter(name='get_type')
def get_type(a):
    b=str(type(a))
    # crop out unnecessary characters 
    return b[8:-2]
