# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-02-06 02:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0048_shortlist_kudos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shortlist',
            name='title',
            field=models.CharField(max_length=30),
        ),
    ]
