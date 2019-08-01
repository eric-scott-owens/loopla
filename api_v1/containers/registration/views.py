from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from actions.models import SimpleAction
from api_v1.containers.registration.serializers import IsEmailRegisteredSerializer, IsUsernameRegisteredSerializer, ValidateNewPasswordSerializer, RegistrationRequestSerializer
from api_v1.containers.user.serializers import UserSerializer
from communications.utilities import compose_email, safe_send_email
from users.models import Person, Tokens, PrivacyPreferences, NotificationPreferences, ToursTaken
from users.utils import get_random_monster
from django.conf import settings

def is_email_in_database(email):
 is_registered = User.objects.filter(email__iexact=email).exists()
 return is_registered 

def is_username_in_database(username):
  is_registered = User.objects.filter(username__iexact=username).exists()
  return is_registered

def get_password_validation_errors(password, user):
  validation_errors = []
  try:
    validate_password(password, user=user)
  except ValidationError as errors:
    for message in errors.messages:
      validation_errors.append(message)

  return validation_errors

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def is_email_registered(request, format=None):
  serializer = IsEmailRegisteredSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)
  is_registered = is_email_in_database(serializer.data['email'])
  return Response({'is_registered': is_registered})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def is_username_registered(request, format=None):
  serializer = IsUsernameRegisteredSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)
  is_registered = is_username_in_database(serializer.data['username'])
  return Response({'is_registered': is_registered})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def validate_new_password(request, format=None):
  serializer = ValidateNewPasswordSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)
  validation_errors = get_password_validation_errors(serializer.data['password'], request.user)
  return Response({'validation_errors': validation_errors})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register_new_user(request, format=None):
  # Validate the incoming data
  serializer = RegistrationRequestSerializer(data=request.data)
  serializer.is_valid(raise_exception=True)

  blocked_by_email = is_email_in_database(serializer.data['email'])
  blocked_by_username = is_username_in_database(serializer.data['username'].lower())
  password_validation_errors = get_password_validation_errors(serializer.data['password'], request.user)

  if blocked_by_email or blocked_by_username or len(password_validation_errors) > 0:
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  # Create the new user
  new_user = User.objects.create_user(
    username = serializer.data['username'].lower(),
    email = serializer.data['email'],
    password = serializer.data['password'],
    first_name = serializer.data['first_name'],
    last_name = serializer.data['last_name'])

  # Add on person data
  new_profile = Person(
    middle_name = serializer.data['middle_name'],
    telephone_number = serializer.data['telephone_number'],
    user = new_user)
  new_profile.save()

  # Add starter profile image
  random_monster_image = get_random_monster()
  new_profile.photo.name = "profile_photos/profile.id." + str(new_user.id) + ".svg"
  fp = default_storage.open(new_profile.photo.name, 'wb')
  fp.write(random_monster_image)
  fp.close()
  new_profile.save()

  # Generate tokens tracker for the new user
  new_tokens = Tokens(user=new_user)
  new_tokens.save()

  # Generate default privacy preferences for the new user
  privacy = PrivacyPreferences(user=new_user)
  privacy.save()

  # Generate default notification preferences from the new user
  notification = NotificationPreferences(user=new_user)
  notification.notify_by_text = serializer.data['send_text_notifications']
  notification.save()

  # Generate default tours taken info the new user
  tours_taken = ToursTaken(user=new_user)
  tours_taken.save()

  updated_user = User.objects.get(pk=new_user.id)
  SimpleAction.log_simple_action(updated_user, 'register')

  # Email a welcome email to the new user
  try:
    context = { 'user': updated_user, 'user_id' : updated_user.id }
    email = compose_email('Welcome to Loopla!', 'email_welcome.html', context, request)
    email.to.append(updated_user.email)
    safe_send_email(email)

  except Exception as error:
    easy_break_point = True

  # Return the newly created user profile
  user_serializer = UserSerializer(updated_user)

  return Response(user_serializer.data)
