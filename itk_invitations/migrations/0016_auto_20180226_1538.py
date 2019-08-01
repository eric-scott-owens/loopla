# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-02-26 15:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0015_invitation_read_email_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitation',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='auth.Group'),
        ),
    ]