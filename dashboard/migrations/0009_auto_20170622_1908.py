# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-22 19:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0008_auto_20170515_2136'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'verbose_name_plural': 'posts'},
        ),
    ]
