from django.db import models
from django.contrib import admin
from itk_invitations.models import UnregisteredUser

class KeepInContact(models.Model):
    contact_info = models.ForeignKey(UnregisteredUser, on_delete=models.CASCADE)
    general_comments = models.TextField(blank=True)
    loop_description = models.TextField(blank=True)
admin.site.register(KeepInContact)
    
