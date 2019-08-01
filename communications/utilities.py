import nexmo, copy, time
from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives
from bs4 import BeautifulSoup
from django.template.loader import render_to_string


# Limit email subject line to this number of characters
# This value is also used in models.py to constrain the size of the variable
max_subject_length = int(80)

def add_generic_settings_to_context(context):
  if context == None:
    context_clone = {}
  else:
    context_clone = copy.deepcopy(context)

  context_clone['EMAIL_SITE_RESOURCES_URL'] = settings.EMAIL_SITE_RESOURCES_URL
  context_clone['BASE_URL'] = settings.BASE_URL
  context_clone['MEDIA_URL'] = settings.MEDIA_URL
  context_clone['NOTIFICATIONS_SERVICE_ADMIN_EMAIL_ADDRESS'] = settings.NOTIFICATIONS_SERVICE_ADMIN_EMAIL_ADDRESS

  return context_clone


def render_template_to_plain_text(text_or_template, context=None, request=None):
  context = add_generic_settings_to_context(context)

  try:
    subject_string = render_to_string(text_or_template, context, request)
    soup = BeautifulSoup(subject_string, 'html.parser') # Turn HTML into plain text
    subject_string = soup.get_text(strip=True) # Remove new line characters
  except:
    subject_string = text_or_template

  return subject_string


def render_template_to_html(text_or_template, context=None, request=None):
  context = add_generic_settings_to_context(context)

  try:
    body = render_to_string(text_or_template, context, request)
  except:
    body = text_or_template
  return body


def compose_email(subject_or_template, body_or_template, context=None, request=None):

  # Render the subject line
  subject = render_template_to_plain_text(subject_or_template, context, request)

  # Render the body
  html_body = render_template_to_html(body_or_template, context, request)
  soup = BeautifulSoup(html_body, 'html.parser')
  plain_text_body = soup.get_text(strip=True)

  # Create the email - without an addressee
  email = EmailMultiAlternatives(subject=subject,
                                  body=plain_text_body,
                                  from_email=settings.DEFAULT_FROM_EMAIL,
                                  headers={})

  email.attach_alternative(html_body, "text/html")
  email.mixed_subtype = 'related' # otherwise image will be displayed as an att

  # Return the email for someone to use it
  return email


def safe_send_email(email):
  # Don't send anything if we shouldn't
  if settings.NOTIFICATIONS_ENABLED:

    # If we are configured to override the email recipient, do so. 
    if settings.NOTIFICATIONS_OVERRIDE_RECIPIENT:
      email.to.clear()
      email.cc.clear()
      email.bcc.clear()
      email.to.append(settings.NOTIFICATIONS_OVERRIDE_RECIPIENT_EMAIL_ADDRESS)

    # Send the email :)
    email.from_email = settings.DEFAULT_FROM_EMAIL
    email.send()


def safe_send_text(message, recipient):
  # Don't send anything if we shouldn't
  if settings.NOTIFICATIONS_ENABLED:

    # If we are configured to override the recipient, do so.
    if settings.NOTIFICATIONS_OVERRIDE_RECIPIENT:
      recipient = settings.NOTIFICATIONS_OVERRIDE_RECIPIENT_TEXT_NUMBER

    nexmo_client = nexmo.Client(key=settings.NEXMO_API_KEY, secret=settings.NEXMO_API_SECRET)
    sender = settings.NEXMO_DEFAULT_FROM
    number_of_attempts = 0
    is_notified = False

    while (number_of_attempts < settings.NOTIFICATIONS_MAX_RETRY) & (is_notified==False):
      response = nexmo_client.send_message({'to':recipient, 'text':message, 'from':sender})

      if response['messages'][0]['status'] != '0':
        print ('Texting error:', response['messages'][0]['error-text'])
        time.sleep(5)
      else:
        print('notified')
        is_notified = True
      number_of_attempts += 1

    return is_notified