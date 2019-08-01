from datetime import datetime
from users.models import Membership
from dashboard.models import Post, Comment
from .email_text_utils import get_status_change_subject, get_status_change_body, get_admin_invitation_subject, get_admin_invitation_body
from itk_invitations.models import Invitation, InvitationMessage, UnregisteredUser
from .models import StatusChange
from django.conf import settings
from communications.utilities import compose_email, safe_send_email

# Called by group_admin()
def change_status (request, user, status_change, person, group, is_send_email, is_initiated_by_user, note=None):
  """Takes action to change the status of a given user"""

  change = status_change[1]
  membership = Membership.objects.get(user=person, group=group)
  now = datetime.utcnow()

  def remove_user_from_group():
    Post.objects.filter(owner=person).filter(group=group).update(is_deleted=True, date_deleted=now)
    Comment.objects.filter(owner=person).filter(post__group=group).update(is_deleted=True, date_deleted=now)
    person.groups.remove(group)
    membership.is_coordinator = False
    membership.is_active = False
    membership.is_removed = True
    membership.date_became_inactive = None
    membership.date_became_coordinator = None
    membership.date_became_removed = now
    membership.save()

  def make_user_inactive():
    membership.is_coordinator = False
    membership.is_active = False
    membership.is_removed = False
    membership.date_became_inactive = now
    membership.date_became_coordinator = None
    membership.date_became_removed = None
    membership.save()

  # Record the status change... unless becoming admin
  if change != 'member_to_admin' and change != 'inactive_to_admin':
    # Status change to admin requires that user accept invitation
    # Change will not be official until they do so.
    sc=StatusChange(user=person, group=group, status_change=status_change[0],
            note=note,
            is_initiated_by_user=is_initiated_by_user)
    sc.save()

  # Handle status changes
  if change == 'admin_to_member':
    membership.is_coordinator = False
    membership.date_became_coordinator = None
    membership.save()

  elif change == 'member_to_admin':

    subject = get_admin_invitation_subject(user, group)
    # The rest of the message is added when it is sent
    body = note
    message = InvitationMessage(subject = subject, message = body)
    message.save()

    nomination = Invitation.create(invitation_type=Invitation.BECOME_GROUP_COORDINATOR,
                             group=group,
                             inviter=user,
                             invitee=person,
                             invitation_message = message)
    nomination.send(request)

  elif change == 'inactive_to_member':
    membership.is_active = True
    membership.date_became_inactive = None
    membership.save()

  elif change == 'admin_to_inactive' or change == 'member_to_inactive':
    make_user_inactive()

  elif change == 'remove_admin' or change == 'remove_member' or change == 'remove_inactive':
    remove_user_from_group()

  # Send status change email
  # This email doesn't go to nominated administrators as they got sent
  # their own email above.
  if change != 'member_to_admin' and change != 'inactive_to_admin' and is_send_email:
    message_subject = get_status_change_subject (user=user, group=group)
    message_body = get_status_change_body(request=request, change=change, user=user, group=group, invitee_first_name=person.first_name, optional_message=note).replace("\r\n", "<br />")
    email = compose_email(message_subject, message_body)
    email.to.append(person.email)
    safe_send_email(email)
