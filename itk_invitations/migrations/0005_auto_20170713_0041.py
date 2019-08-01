# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-13 00:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('itk_invitations', '0004_auto_20170627_1851'),
    ]

    operations = [
        migrations.CreateModel(
            name='Nomination',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=64, unique=True)),
                ('sent_timestamp', models.DateTimeField(blank=True, null=True)),
                ('response_timestamp', models.DateTimeField(blank=True, null=True)),
                ('is_accepted', models.BooleanField(default=False)),
                ('is_declined', models.BooleanField(default=False)),
                ('response_message', models.TextField(blank=True)),
                ('confirmed_nominee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='confirmed_nominee', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Nomination_Visit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_action_timestamp', models.DateTimeField(blank=True)),
                ('last_action_timestamp', models.DateTimeField(blank=True, null=True)),
                ('nomination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='itk_invitations.Nomination')),
            ],
        ),
        migrations.CreateModel(
            name='NominationMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='unregistereduser',
            name='middle_name',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='nomination',
            name='nomination_message',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='itk_invitations.NominationMessage'),
        ),
        migrations.AddField(
            model_name='nomination',
            name='nominator',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='nominator', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nomination',
            name='nominee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='itk_invitations.UnregisteredUser'),
        ),
    ]
