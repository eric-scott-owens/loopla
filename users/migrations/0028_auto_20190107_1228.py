# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-07 17:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0027_tokens_give_kudos'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notificationpreferences',
            name='frequency',
        ),
        migrations.RemoveField(
            model_name='notificationpreferences',
            name='method',
        ),
        migrations.AddField(
            model_name='notificationpreferences',
            name='notify_by_email',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='notificationpreferences',
            name='notify_by_text',
            field=models.BooleanField(default=True),
        ),
    ]
