from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class JavaScriptClientCommand(models.Model):
  ### Defines a command that should be run on a client device
  ### this can be any JS statement and will be evaluated by
  ### the client at runtime
  ###
  ### Clients will only run tasks once
  command = models.TextField()