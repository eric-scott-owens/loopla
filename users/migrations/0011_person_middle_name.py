# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-15 14:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_auto_20170627_1740'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='middle_name',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]
