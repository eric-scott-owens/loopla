# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-08-15 15:21
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_person_processed_profile_photo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='person',
            old_name='processed_profile_photo',
            new_name='photo',
        ),
    ]
