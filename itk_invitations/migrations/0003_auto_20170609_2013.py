# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-09 20:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0002_auto_20170609_2004'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitation_visit',
            name='last_action_timestamp',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
