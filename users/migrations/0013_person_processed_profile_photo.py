# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-08-14 23:27
from __future__ import unicode_literals

from django.db import migrations
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_auto_20170728_2127'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='processed_profile_photo',
            field=imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='profile_photos'),
        ),
    ]
