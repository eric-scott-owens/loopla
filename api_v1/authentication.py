import datetime
from django.utils.timezone import utc
from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
from django.utils.six import text_type
import base64
import binascii
from django.contrib.auth import get_user_model
from django.middleware.csrf import CsrfViewMiddleware
from django.utils.translation import ugettext_lazy as _
from django.utils.timezone import utc
from rest_framework import HTTP_HEADER_ENCODING, exceptions
from rest_framework.compat import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import pytz

def get_the_authorization_header(request):
    """
    Return request's 'Authorization:' header, as a bytestring.

    Hide some test client ickyness where the header can be unicode.
    """
    auth = request.META.get('HTTP_AUTHORIZATION', b'')
    if isinstance(auth, text_type):
        # Work around django test client oddness
        auth = auth.encode(HTTP_HEADER_ENCODING)
    return auth

class ExpiringTokenAuthentication(TokenAuthentication):
    def get_model(self):
        if self.model is not None:
            return self.model
        from rest_framework.authtoken.models import Token
        return Token

    def authenticate(self, request):
        auth = get_the_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            msg = _('Invalid token header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid token header. Token string should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        try:
            token = auth[1].decode()
        except UnicodeError:
            msg = _('Invalid token header. Token string should not contain invalid characters.')
            raise exceptions.AuthenticationFailed(msg)

        return self.authenticate_credentials(token)
  
    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token.')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted.')

        utc_now = datetime.datetime.utcnow()
        utc_now = utc_now.replace(tzinfo=pytz.utc)

        if token.created < utc_now - datetime.timedelta(days=30):
            raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)

    def authenticate_header(self, request):
        return self.keyword



class AuthenticatedOrAnonymousAuthentication(ExpiringTokenAuthentication):
    def authenticate(self, request):
        try:
            return super(AuthenticatedOrAnonymousAuthentication, self).authenticate(request)
        except:
            return None
