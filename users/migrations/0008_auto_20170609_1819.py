# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-09 18:19
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20170530_2005'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='unregistereduser',
            name='group',
        ),
        migrations.RemoveField(
            model_name='unregistereduser',
            name='message',
        ),
        migrations.DeleteModel(
            name='InvitationMessage',
        ),
        migrations.DeleteModel(
            name='UnregisteredUser',
        ),
    ]
