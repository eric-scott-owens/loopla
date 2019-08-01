# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-02-01 22:01
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0008_alter_user_username_max_length'),
        ('dashboard', '0046_auto_20180126_0152'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfeedback',
            name='original_group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='auth.Group'),
        ),
        migrations.AddField(
            model_name='userfeedback',
            name='original_owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]
