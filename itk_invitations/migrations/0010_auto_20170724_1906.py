# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-24 19:06
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0009_coordinator_nomination_visit'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coordinator_nomination_visit',
            old_name='nomination',
            new_name='coordinator_nomination',
        ),
    ]
