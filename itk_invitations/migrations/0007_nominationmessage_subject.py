# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-22 20:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0006_invitationmessage_subject'),
    ]

    operations = [
        migrations.AddField(
            model_name='nominationmessage',
            name='subject',
            field=models.CharField(blank=True, max_length=80),
        ),
    ]