# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-09-22 19:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0023_userevent_sender'),
        ('actions', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='receivedreplytopost',
            name='post',
        ),
        migrations.AddField(
            model_name='receivedreplytopost',
            name='reply',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='dashboard.Comment'),
            preserve_default=False,
        ),
    ]
