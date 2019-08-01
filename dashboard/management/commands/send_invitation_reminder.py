#!/usr/bin/env python
import os
import sys
from django.urls import reverse
from django.core.management.base import BaseCommand, CommandError
from email.mime.image import MIMEImage
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.db.models import Q
from users.models import Membership
from itk_invitations.models import Invitation
from django.contrib.sites.models import Site
from dashboard.models import Post, Comment, ShortList
from django.utils import timezone
from datetime import datetime, timedelta
from communications.utilities import compose_email, safe_send_email

class Command(BaseCommand):
  def handle(self, *args, **options):
    current_date = timezone.now().replace(hour=0, minute=0)
    reminder_number_max = settings.NOTIFICATIONS_NEW_INVITE_REMINDER_NUMBER_MAX
    reminder_days_required = settings.NOTIFICATIONS_NEW_INVITE_REMINDER_DAYS_REQUIRED
    date_threshold = current_date - timedelta(days = reminder_number_max * 
          reminder_days_required)
    filter_invitations = None
    for period in range(1, reminder_number_max + 1):
      date_threshold = current_date - timedelta(days = period * reminder_days_required)
      query = Q(is_accepted = False, sent_timestamp__gte=date_threshold, sent_timestamp__lte=date_threshold + timedelta(days=1))
      if filter_invitations == None:
        filter_invitations = query
      else:
        filter_invitations = filter_invitations | query
        
    invitations = Invitation.objects.filter(filter_invitations)

    for invitation in invitations:
      site_name = settings.BASE_URL
      invitation_url = '%s/invitation/%s/' %(site_name, invitation.key)
      group = invitation.group
      subject = "Invitation from " + invitation.inviter.first_name + " to Join " + group.circle.name.title()

      n_posts = Post.objects.filter(group=group).count()
      n_comments = Comment.objects.filter(post__group=group).count()

      users = User.objects.filter(groups=group)
      n_short_list = ShortList.objects.filter(owner__in=users).count()

      context = {'user': invitation.inviter,
          'group': group,
          'invitee_first_name': invitation.invitee.first_name,
          'n_members': str(Membership.objects.filter(group=group).count()),
          'n_posts_comments': str(n_posts + n_comments),
          'n_short_list': str(n_short_list),
          'url' : invitation_url}

      email = compose_email(subject, "email_invitation_member_reminder.html", context)
      email.to.append(invitation.invitee.email)
      safe_send_email(email)