#!/usr/bin/env python
import os
import sys
from pdb import set_trace as bp
from django.urls import reverse
from django.core.management.base import BaseCommand, CommandError
from email.mime.image import MIMEImage
from django.conf import settings
from django.contrib.auth.models import User, Group
from users.models import Membership
from itk_invitations.models import Invitation
from dashboard.models import Post, Comment, ShortList
from communications.utilities import compose_email, safe_send_email


class Command(BaseCommand):
  def handle(self, *args, **options):

    # Roll the Dice = 223
    # Rolling the Dice = 224
    group = Group.objects.get(id=224)

    #users = User.objects.filter(groups=group)
    users = User.objects.filter(id=7)
    #users = User.objects.filter(last_name="Cuthbert")

    n_display = 5

    for user in users:

      subject = "Welcome to Loopla!"
      context = {'user': user, 'group': group }
      email = compose_email(subject, "groups/email_template_2.html", context)
      email.to.append(settings.NOTIFICATIONS_SERVICE_ADMIN_EMAIL_ADDRESS)
      safe_send_email(email)
