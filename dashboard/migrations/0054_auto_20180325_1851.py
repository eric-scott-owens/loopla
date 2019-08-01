# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-03-25 18:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0053_place'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='places',
            field=models.ManyToManyField(to='dashboard.Place'),
        ),
        migrations.AddField(
            model_name='post',
            name='places',
            field=models.ManyToManyField(to='dashboard.Place'),
        ),
        migrations.AddField(
            model_name='shortlist',
            name='places',
            field=models.ManyToManyField(to='dashboard.Place'),
        ),
    ]