# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-10 02:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0030_auto_20171107_1924'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='date_last_comment_added',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]