# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-30 20:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_invitationmessage_unregistereduser'),
    ]

    operations = [
        migrations.RenameField(
            model_name='unregistereduser',
            old_name='coordinator_invitation',
            new_name='is_coordinator',
        ),
        migrations.AlterField(
            model_name='invitationmessage',
            name='message',
            field=models.TextField(blank=True),
        ),
    ]
