
from bs4 import BeautifulSoup
from django.conf import settings
from communications.utilities import render_template_to_html, render_template_to_plain_text

# Limit email subject line to this number of characters
# This value is also used in models.py to constrain the size of the variable
max_subject_length = int(80)

def get_member_invitation_subject (user, group):
  """ Get the string to be used in the subject of an email inviting """
  """ a person to join a loop                                       """

  context = {'user' : user, 'group' : group}

  # Generate html
  subject_string = render_template_to_plain_text("email_invitation_member_subject_1.html", context)

  # If string is longer than allowed generate an alternative string
  if len(subject_string) > max_subject_length:
    subject_string = render_template_to_plain_text("email_invitation_member_subject_2.html", context)
    if len(subject_string) > max_subject_length:
      subject_string = render_template_to_plain_text("email_invitation_member_subject_3.html", context)
      if len(subject_string) > max_subject_length:
        subject_string = render_template_to_plain_text("email_invitation_member_subject_4.html", context)

  return subject_string



def get_member_invitation_body (request, user, group, invitee_first_name=None,  optional_message=None, url=None, is_disabled_button=False, invitation_id=None, read_receipt_url=None):
  """ Body of email message sent as invitation to join a loop """
  """ Note that the 'request' object is necessary in order to invoke """
  """ the context processors. Otherwise, EMAIL_SITE_RESOURCES_URL path will not be available """
  """ in loopla_signature.html """

  if is_disabled_button:
    is_disabled = "disabled"
  else:
    is_disabled = ''

  if url:
    is_real_email = True
  else:
    is_real_email = False

  context = {'invitee_first_name' : invitee_first_name,
             'user' : user,
             'group' : group,
             'optional_message' : optional_message,
             'disabled' : is_disabled,
             'url' : url,
             'is_real_email' : is_real_email,
             'invitation_id' : invitation_id,
             'read_receipt_url' : read_receipt_url,
             'user_id': user.id}

  # The request object must be passed, otherwise the context processor
  # will not have access to the EMAIL_SITE_RESOURCES_URL path
  body = render_template_to_html("email_invitation_member.html", context, request=request)
  return body


def get_admin_invitation_subject (user, group):
  """ Get the string to be used in the subject of an email inviting """
  """ a person to join a loop                                       """

  context = {'user' : user,
         'group' : group,
         'user_id': user.id}

  # Generate html
  subject_string = render_template_to_plain_text("email_invitation_admin_subject_1.html", context)

  # If string is longer than allowed generate an alternative string
  if len(subject_string) > max_subject_length:
    subject_string = render_template_to_plain_text ("email_invitation_admin_subject_2.html", context)
    if len(subject_string) > max_subject_length:
      subject_string = render_template_to_plain_text ("email_invitation_admin_subject_3.html", context)
      if len(subject_string) > max_subject_length:
        subject_string = render_template_to_plain_text ("email_invitation_admin_subject_4.html", context)

  return subject_string


def get_admin_invitation_body (request, user, group, optional_message=None, invitee_first_name=None, url=None, invitation_id=None, read_receipt_url=None):

  if url:
    is_real_email = True
  else:
    is_real_email = False


  context = {'invitee_first_name' : invitee_first_name,
         'user' : user,
         'group' : group,
         'optional_message' : optional_message,
         'url' : url,
         'is_real_email' : is_real_email,
         'invitation_id' : invitation_id,
         'read_receipt_url' : read_receipt_url}

  try:
    body = render_template_to_html("email_invitation_admin.html", context, request=request)
  except Exception as e:
    print(e)
    return

  return body


def get_founder_invitation_subject (user, group):
  """ Gets the string to be used in the subject of an email nominating """
  """ a person to found a new loop """

  context = {'user' : user,
         'group' : group}

  subject_string = render_template_to_plain_text("groups/invitation_founder_subject.1.html", context)

  if len(subject_string) > max_subject_length:
    subject_string = render_template_to_plain_text("groups/invitation_founder_subject.2.html", context)

  return subject_string


def get_founder_invitation_body (request, user, group=None, optional_message=None, invitee_first_name=None, url=None, read_receipt_url=None):

  context = {'invitee_first_name' : invitee_first_name,
         'user' : user,
         'group' : group,
         'optional_message' : optional_message,
         'url' : url,
         'read_receipt_url' : read_receipt_url}

  body = render_template_to_html("groups/invitation_founder_body.html", context, request=request)
  return body


def get_status_change_subject (user, group):
  """ Gets the string to be used in the subject of an email informing """
  """ a user of a change in their status within a particular loop """

  context = {'user' : user,
         'group' : group}

  subject_string = render_template_to_plain_text("email_status_change_subject_1.html", context)

  if len(subject_string) > max_subject_length:
    subject_string = render_template_to_plain_text("email_status_change_subject_2.html", context)
    
  return subject_string


def get_status_change_body (request, change, user, group=None, invitee_first_name=None, optional_message=None):
  """ Body of email message sent when a user's status within a loop changes """

  context = {'change' : change,
         'invitee_first_name' : invitee_first_name,
         'user' : user,
         'group' : group,
         'optional_message' : optional_message}

  body = render_template_to_html("email_status_change.html", context, request=request)
  return body
