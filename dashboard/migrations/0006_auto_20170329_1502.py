# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-03-29 15:02
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_auto_20170329_1452'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='text',
            new_name='name',
        ),
    ]