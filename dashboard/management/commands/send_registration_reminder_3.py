#!/usr/bin/env python
import os
import sys
from django.urls import reverse
from django.core.management.base import BaseCommand, CommandError
from email.mime.image import MIMEImage
from django.conf import settings
from django.contrib.auth.models import User, Group
from users.models import Membership
from itk_invitations.models import Invitation
from dashboard.models import Post, Comment, ShortList
from communications.utilities import compose_email, safe_send_email

# Working version of registration reminder.
# Hard-coded to loop name

class Command(BaseCommand):
  def handle(self, *args, **options):

    # Roll the Dice = 223
    # Rolling the Dice = 224
    group = Group.objects.get(id=224)

    invitations = Invitation.objects.filter(group = group, is_accepted = False, is_declined=False)

    for invitation in invitations:

      invitation_url = reverse('invitations:view_invitation', args=[invitation.key])
      site_name = "https://www.loopla.com/"
      invitation_url = site_name + invitation_url

      subject = "Invitation from " + invitation.inviter.first_name + " to join " + group.name.title()

      n_posts = Post.objects.filter(group=group).count()
      n_comments = Comment.objects.filter(post__group=group).count()

      users = User.objects.filter(groups=group)
      n_short_list = ShortList.objects.filter(owner__in=users).count()

      context = {'user': invitation.invitee,
           'group': group,
           'n_members': str(Membership.objects.filter(group=group).count()),
           'n_posts_comments': str(n_posts + n_comments),
           'n_short_list': str(n_short_list),
           'url' : invitation_url}

      email = compose_email(subject, "groups/email_template_1.html", context)
      email.to.append(settings.NOTIFICATIONS_SERVICE_ADMIN_EMAIL_ADDRESS)
      safe_send_email(email)
      