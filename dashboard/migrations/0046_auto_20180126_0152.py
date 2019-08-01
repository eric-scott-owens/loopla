# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-01-26 01:52
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0045_auto_20180125_2005'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserFeedback',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_visible_to_group', models.BooleanField()),
                ('internal_copy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='to_original', to='dashboard.Post')),
                ('original', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='to_internal_copy', to='dashboard.Post')),
            ],
        ),
        migrations.RemoveField(
            model_name='feedbackfromuser',
            name='group',
        ),
        migrations.RemoveField(
            model_name='feedbackfromuser',
            name='owner',
        ),
        migrations.DeleteModel(
            name='FeedbackFromUser',
        ),
    ]
