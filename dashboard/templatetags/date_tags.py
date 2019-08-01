
import pytz
from datetime import timedelta, datetime
from django import template
from pdb import set_trace as bp

register = template.Library()

@register.filter(name='shorten_date')
def shorten_date(date):
    if date:
        time_now = datetime.now(tz=pytz.UTC)
        elapsed_time = time_now - date
        seconds = elapsed_time.total_seconds()
        if seconds < 60:
            new_date_string = '0m'
        elif seconds < 60 * 60:
            new_date_string = "%i" % (seconds//60) + 'm'
        elif seconds < 60 * 60 * 24:
            new_date_string = "%i" % (seconds//(60 * 60)) + 'h'
        elif seconds < 60 * 60 * 24 * 31:
            new_date_string = "%i" % (seconds//(60 * 60 * 24)) + 'd'
        elif seconds < 60 * 60 * 24 * 365:
            new_date_string = date.strftime("%b %d")
        else:
            new_date_string = date.strftime("%x")
    else:
        new_date_string = ''

    return new_date_string


@register.filter(name='is_later')
def is_later(date_modified, date_added):
    elapsed_time = date_modified - date_added
    seconds = elapsed_time.total_seconds()
    if seconds < 120:
        return False
    else:
        return True


@register.filter(name='return_item')
def return_item(l, i):
    try:
        return l[i]
    except:
        return None


@register.filter(name='return_caption')
def return_caption(l, i):
    try:
        return l[i].caption
    except:
        return None

@register.filter(name='smart_truncate_characters')
def smart_truncate_characters(content, length):
    suffix="..."
    if len(content) <= int(length):
        return content
    else:
        return content[:int(length)].rsplit(' ', 1)[0]+suffix
