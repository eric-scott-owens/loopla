# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-24 19:05
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0008_coordinator_nomination'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coordinator_Nomination_Visit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_action_timestamp', models.DateTimeField(blank=True)),
                ('last_action_timestamp', models.DateTimeField(blank=True, null=True)),
                ('nomination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='itk_invitations.Coordinator_Nomination')),
            ],
        ),
    ]