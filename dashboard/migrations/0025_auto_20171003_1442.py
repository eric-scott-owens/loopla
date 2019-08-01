# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-10-03 14:42
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0024_auto_20170924_1834'),
    ]

    operations = [
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
                ('category_parent', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='child_labels', to='dashboard.Category')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='category',
            name='label',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.Label'),
        ),
    ]