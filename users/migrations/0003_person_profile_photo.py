# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-20 22:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_membership_coordinator'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to='profile_photos'),
        ),
    ]