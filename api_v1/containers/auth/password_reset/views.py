from django.conf import settings
from django.contrib.auth import (
  get_user_model, login as auth_login,
)
from django.contrib.auth.forms import (
  PasswordResetForm, SetPasswordForm
)
from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.utils.encoding import force_text
from django.utils.decorators import method_decorator
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from api_v1.containers.auth.password_reset.serializers import PasswordResetSerializer



# Class-based password reset views
# - PasswordResetView sends the mail
# - PasswordResetDoneView shows a success message for the above
# - PasswordResetConfirmView checks the link the user clicked and
#   prompts for a new password
# - PasswordResetCompleteView shows a success message for the above

sensitive_post_parameters_m = method_decorator(
  sensitive_post_parameters(
    'password', 'old_password', 'new_password1', 'new_password2'
  )
)

UserModel = get_user_model()
INTERNAL_RESET_URL_TOKEN = 'set-password'
INTERNAL_RESET_SESSION_TOKEN = '_password_reset_token'

class PasswordContextMixin(object):
  extra_context = None

  def get_context_data(self, **kwargs):
    context = super(PasswordContextMixin, self).get_context_data(**kwargs)
    context['title'] = self.title
    if self.extra_context is not None:
      context.update(self.extra_context)
    return context


class PasswordResetView(GenericAPIView):
  """6
  Calls Django Auth PasswordResetForm save method.

  Accepts the following POST parameters: email
  Returns the success/fail message.
  """
  serializer_class = PasswordResetSerializer
  permission_classes = (AllowAny,)

  def post(self, request, *args, **kwargs):
    # Create a serializer with request.data
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    serializer.save()
    # Return the success message with OK HTTP status
    return Response(
      {"detail": _("Password reset e-mail has been sent.")},
      status=status.HTTP_200_OK
    )


class PasswordResetDoneView(PasswordContextMixin, TemplateView):
  template_name = 'registration/password_reset_done.html'
  title = _('Password reset sent')


class PasswordResetConfirmView(PasswordContextMixin, FormView):
  form_class = SetPasswordForm
  post_reset_login = False
  post_reset_login_backend = None
  success_url = reverse_lazy('api_v1:password_reset_complete')
  template_name = 'registration/password_reset_confirm.html'
  title = _('Enter new password')
  token_generator = default_token_generator

  @method_decorator(sensitive_post_parameters())
  @method_decorator(never_cache)
  def dispatch(self, *args, **kwargs):
    assert 'uidb64' in kwargs and 'token' in kwargs

    self.validlink = False
    self.user = self.get_user(kwargs['uidb64'])

    if self.user is not None:
      token = kwargs['token']
      if token == INTERNAL_RESET_URL_TOKEN:
        session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
        if self.token_generator.check_token(self.user, session_token):
          # If the token is valid, display the password reset form.
          self.validlink = True
          return super(PasswordResetConfirmView, self).dispatch(*args, **kwargs)
      else:
        if self.token_generator.check_token(self.user, token):
          # Store the token in the session and redirect to the
          # password reset form at a URL without the token. That
          # avoids the possibility of leaking the token in the
          # HTTP Referer header.
          self.request.session[INTERNAL_RESET_SESSION_TOKEN] = token
          # redirect_url = self.request.path.replace(token, INTERNAL_RESET_URL_TOKEN)
          redirect_url = '/password-reset/' + self.kwargs['uidb64'] + '/' + self.kwargs['token'] + '/'
          return HttpResponseRedirect(redirect_url)

    # Display the "Password reset unsuccessful" page.
    return self.render_to_response(self.get_context_data())

  def get_user(self, uidb64):
    try:
      # urlsafe_base64_decode() decodes to bytestring on Python 3
      uid = force_text(urlsafe_base64_decode(uidb64))
      user = UserModel._default_manager.get(pk=uid)
    except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
      user = None
    return user

  def get_form_kwargs(self):
    kwargs = super(PasswordResetConfirmView, self).get_form_kwargs()
    kwargs['user'] = self.user
    return kwargs

  def form_valid(self, form):
    user = form.save()
    del self.request.session[INTERNAL_RESET_SESSION_TOKEN]
    if self.post_reset_login:
      auth_login(self.request, user, self.post_reset_login_backend)
    return super(PasswordResetConfirmView, self).form_valid(form)

  def get_context_data(self, **kwargs):
    context = super(PasswordResetConfirmView, self).get_context_data(**kwargs)
    if self.validlink:
      context['validlink'] = True
    else:
      context.update({
        'form': None,
        'title': _('Password reset unsuccessful'),
        'validlink': False,
      })
    return context


class PasswordResetCompleteView(PasswordContextMixin, TemplateView):
  template_name = 'registration/password_reset_complete.html'
  title = _('Password reset complete')

  def get_context_data(self, **kwargs):
    context = super(PasswordResetCompleteView, self).get_context_data(**kwargs)
    context['login_url'] = resolve_url(settings.LOGIN_URL)
    return context
