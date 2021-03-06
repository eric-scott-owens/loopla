# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-09-12 01:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0019_auto_20170905_1819'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='kudos',
            field=models.ManyToManyField(related_name='comment_appreciator', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='post',
            name='kudos',
            field=models.ManyToManyField(related_name='post_appreciator', to=settings.AUTH_USER_MODEL),
        ),
    ]
