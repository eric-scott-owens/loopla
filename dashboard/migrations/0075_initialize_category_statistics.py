# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-07-19 16:26
from __future__ import unicode_literals
import json
from django.db import migrations
from django.db.models import Q

def calculate_statistics(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Category = apps.get_model('dashboard', 'Category')
    Post = apps.get_model('dashboard', 'Post')
    CategoryStatistics = apps.get_model('dashboard', 'CategoryStatistics')
    
    groups = Group.objects.all()
    categories = Category.objects.all()
    for group in groups:
        # For each category
        for category in categories:
            statistic = None
            if CategoryStatistics.objects.filter(category=category, group=group).exists():
                statistic = CategoryStatistics.objects.get(category=category, group=group)
            else:
                statistic = CategoryStatistics(category=category, group=group)

            posts = Post.objects.filter(
                Q(group=group) & (
                    Q(categories__in=[category]) |
                    Q(categories__parent__in=[category]) |
                    Q(comments__categories__in=[category]) |
                    Q(comments__categories__parent__in=[category])
                )
            ).distinct('id','newest_update').order_by('newest_update').values('id', 'owner_id', 'newest_update')

            posts = list(posts)
            statistic.post_count = len(posts)
            post_references_json = json.dumps(posts, default=str)
            statistic.post_references = post_references_json
            statistic.save()

        # For all
        statistic = None
        if CategoryStatistics.objects.filter(category=None, group=group).exists():
            statistic = CategoryStatistics.objects.get(category=None, group=group)
        else:
            statistic = CategoryStatistics(category=None, group=group)

        posts = Post.objects.filter(group=group,is_deleted=False).distinct('id','newest_update').order_by('newest_update').values('id', 'owner_id', 'newest_update')
        posts = list(posts)
        statistic.post_count = len(posts)
        post_references_json = json.dumps(posts, default=str)
        statistic.post_references = post_references_json
        statistic.save()


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0074_give-comments-categories-based-on-tags'),
    ]

    operations = [
        migrations.RunPython(calculate_statistics)
    ]