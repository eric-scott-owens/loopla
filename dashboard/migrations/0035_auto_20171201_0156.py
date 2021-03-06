# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-12-01 01:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0034_shortlist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shortlist',
            name='contact_information',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AlterField(
            model_name='shortlist',
            name='object_id',
            field=models.PositiveIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='shortlist',
            name='short_description',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AlterField(
            model_name='shortlist',
            name='title',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]
