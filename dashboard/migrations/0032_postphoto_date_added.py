# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-27 18:31
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0031_post_date_last_comment_added'),
    ]

    operations = [
        migrations.AddField(
            model_name='postphoto',
            name='date_added',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]