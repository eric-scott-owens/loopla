# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-06-21 18:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0043_default-daily-summry-emails-on'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='date_first_posted',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='membership',
            name='user_engagement_section_dismissed',
            field=models.BooleanField(default=False),
        ),
    ]
