# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-03-17 22:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='coordinator',
            field=models.BooleanField(default=False),
        ),
    ]