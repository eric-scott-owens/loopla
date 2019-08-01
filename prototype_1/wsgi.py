"""
WSGI config for prototype_1 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/

Also, see https://devcenter.heroku.com/articles/django-app-configuration
"""

import os

from django.core.wsgi import get_wsgi_application
#from whitenoise.django import DjangoWhiteNoise


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "prototype_1.settings_production")

application = get_wsgi_application()
#application = DjangoWhiteNoise(application)
