# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-10-11 12:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('dashboard', '0027_auto_20171009_0028'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='postphoto',
            name='post',
        ),
        migrations.AddField(
            model_name='postphoto',
            name='content_type',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='postphoto',
            name='object_id',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
    ]
