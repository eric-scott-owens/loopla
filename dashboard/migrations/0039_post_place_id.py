# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-12-07 02:26
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0038_auto_20171206_2002'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='place_id',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=80), blank=True, null=True, size=None),
        ),
    ]
