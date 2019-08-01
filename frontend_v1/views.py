from django.shortcuts import render
from django.conf import settings


def index(request):
    context = {
      'SERVER_SITE_ASSETS_FROM_S3': settings.SERVER_SITE_ASSETS_FROM_S3,
      'SITE_RESOURCES_URL': settings.SITE_RESOURCES_URL,
      'MEDIA_URL': settings.MEDIA_URL,
      'DEPLOYMENT_ENVIRONMENT': settings.DEPLOYMENT_ENVIRONMENT,
      'RESTRICT_LOOP_CREATION': settings.RESTRICT_LOOP_CREATION,
      'RESTRICT_LOOP_CREATION_ALLOWED_LOOPS': settings.RESTRICT_LOOP_CREATION_ALLOWED_LOOPS,
      'STRIPE_PUBLIC_KEY': settings.STRIPE_PUBLIC_KEY,
      'KUDOS_ENABLED': settings.KUDOS_ENABLED,
      'KUDOS_STORE_ENABLED': settings.KUDOS_STORE_ENABLED, 
      'SOCKET_IO_SERVER_HOST': settings.SOCKET_IO_SERVER_HOST,
      'SOCKET_IO_SERVER_PORT': settings.SOCKET_IO_SERVER_PORT
    }
    return render(request, 'frontend_v1/index.html', context)
