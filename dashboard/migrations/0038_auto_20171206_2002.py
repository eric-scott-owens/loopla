# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-12-06 20:02
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0037_shortlist_place'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='shortlist',
            options={'ordering': ['date_added']},
        ),
    ]
