# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-08 17:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion

def fill_table_defaults(apps, schema_editor):
    Membership = apps.get_model('users', 'Membership')
    SummaryPreferences = apps.get_model('users', 'SummaryPreferences')
    for membership in Membership.objects.all():
        SummaryPreferences.objects.create(membership = membership)


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0030_summarypreferences'),
    ]

    operations = [
        migrations.RunPython(fill_table_defaults)
    ]


