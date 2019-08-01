# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-02-20 19:23
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_membership_date_became_coordinator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='privacypreferences',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='privacy_preferences', to=settings.AUTH_USER_MODEL),
        ),
    ]
