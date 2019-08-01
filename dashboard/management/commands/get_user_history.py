#!/usr/bin/env python
import os
import sys
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth.models import User

from actions.utils import get_individual_actions
from communications.utilities import compose_email, safe_send_email

class Command(BaseCommand):
  def handle(self, *args, **options):
    names = ['henry'] #, 'AnneLopez']
    ids = ['7','3']

    #for name in names:
    #  user = User.objects.get (username=name)
    for i in ids:
      user = User.objects.get (id=i)
      actions = get_individual_actions (user)

      subject = user.first_name + "'s Loopla Summary"

      lines = []

      for key in actions:
        s = key + ": " + str(len(actions[key]))
        lines.append(s)

      body = '\n'.join(lines)

      email = compose_email(subject, body)
      email.to.append(user.email)
      safe_send_email(email)

