# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-05-01 15:49
from __future__ import unicode_literals

from django.db import migrations, models
import imagekit.models.fields
import storages.backends.s3boto3


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0065_migrate-photos-to-component'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='postphoto',
            name='content_type',
        ),
        migrations.AddField(
            model_name='comment',
            name='text_rich_json',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='post',
            name='text_rich_json',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='photo',
            name='image',
            field=imagekit.models.fields.ProcessedImageField(storage=storages.backends.s3boto3.S3Boto3Storage(bucket='loopla-secure-dev'), upload_to='images'),
        ),
        migrations.DeleteModel(
            name='PostPhoto',
        ),
    ]
