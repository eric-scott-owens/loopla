# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-10-11 12:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0022_auto_20171009_0028'),
    ]

    operations = [
        migrations.AlterField(
            model_name='privacypreferences',
            name='is_share_address',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='privacypreferences',
            name='is_share_email',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='privacypreferences',
            name='is_share_phone',
            field=models.BooleanField(default=False),
        ),
    ]