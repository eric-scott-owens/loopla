import json, pytz, datetime
from django.http import HttpResponse
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from api_v1.authentication import AuthenticatedOrAnonymousAuthentication
from api_v1.containers.auth.login.serializers import ExpiringAuthTokenSerializer
import json

class ObtainExpiringAuthToken(ObtainAuthToken):
  serializer_class = ExpiringAuthTokenSerializer

  def post(self, request):
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      user = serializer.validated_data['user']
      token, created =  Token.objects.get_or_create(user=user)

      utc_now = datetime.datetime.utcnow()  
      utc_now = utc_now.replace(tzinfo=pytz.utc)

      if not created and token.created < utc_now - datetime.timedelta(days=30):
        token.delete()
        user = serializer.validated_data['user']
        token = Token.objects.create(user=user)
        token.created = datetime.datetime.utcnow()
        token.save()

      #return Response({'token': token.key})
      response_data = {'token': token.key}
      return HttpResponse(json.dumps(response_data), content_type="application/json")

    return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
