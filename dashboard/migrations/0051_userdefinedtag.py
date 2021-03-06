# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-03-08 14:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0050_auto_20180227_1351'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserDefinedTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'user_defined_tags',
                'ordering': ['name'],
            },
        ),
    ]
