# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-27 18:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0003_auto_20170609_2013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitationmessage',
            name='message',
            field=models.TextField(blank=True),
        ),
    ]
