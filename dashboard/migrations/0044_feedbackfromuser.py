# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-01-25 20:00
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0008_alter_user_username_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dashboard', '0043_shortlist_tags_user_generated'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeedbackFromUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_visible_to_group', models.BooleanField()),
                ('message', models.TextField()),
                ('group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='auth.Group')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
