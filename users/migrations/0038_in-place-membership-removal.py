# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-03-05 17:12
from __future__ import unicode_literals

from datetime import datetime
from django.db import migrations, models
from django.db.models import Q

# A bit inefficient, but simple to undersand and works
# for both scenarios we test for in add_missing_memberships
def get_dates(posts_or_comments):
    dates = []
    for thing in posts_or_comments:
        if thing:
            dates.append(thing.date_added)
            if(thing.date_modified):
                dates.append(thing.date_modified)
        
    return dates

# Add memberships, marked as removed, for users who
# do not have memberships in loops in which they have
# contributed
def add_missing_memberships(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Group = apps.get_model('auth', 'Group')
    Membership = apps.get_model('users', 'Membership')
    Post = apps.get_model('dashboard', 'Post')
    Comment = apps.get_model('dashboard', 'Comment')

    # Try to backfill removal membership records for everyone 
    for user in User.objects.all():
        user_membership_group_ids = Membership.objects.filter(user=user).values('group_id').distinct('group_id')
        group_ids_with_posts_from_user = Post.objects.filter(owner=user).values('group_id').distinct('group_id')
        group_ids_with_comments_from_user = Comment.objects.filter(owner=user).values('post__group_id').distinct('post__group_id')
        groups_to_create_memberships_for = Group.objects.filter(Q(pk__in=group_ids_with_posts_from_user) | Q(pk__in=group_ids_with_comments_from_user)).exclude(pk__in=user_membership_group_ids).distinct()
        
        for group in groups_to_create_memberships_for:
            # Find the dates to use
            posts_or_comments = []

            if Post.objects.filter(group=group, owner=user).exists():
                posts_or_comments.append(Post.objects.filter(group=group, owner=user).latest('date_added'))
                posts_or_comments.append(Post.objects.filter(group=group, owner=user).latest('date_modified'))
                posts_or_comments.append(Post.objects.filter(group=group, owner=user).earliest('date_added'))
                posts_or_comments.append(Post.objects.filter(group=group, owner=user).earliest('date_modified'))

            if Comment.objects.filter(post__group=group, owner=user).exists():
                posts_or_comments.append(Comment.objects.filter(post__group=group, owner=user).latest('date_added'))
                posts_or_comments.append(Comment.objects.filter(post__group=group, owner=user).latest('date_modified'))
                posts_or_comments.append(Comment.objects.filter(post__group=group, owner=user).earliest('date_added'))
                posts_or_comments.append(Comment.objects.filter(post__group=group, owner=user).earliest('date_modified'))

            user_contribution_date_range_candidates = get_dates(posts_or_comments)

            newest_group_contribution_date = max(user_contribution_date_range_candidates)
            oldest_group_contribution_date = min(user_contribution_date_range_candidates)

            # Create the membership
            membership = Membership(user=user)
            membership.group = group
            membership.is_active = False
            membership.is_coordinator = False
            membership.is_removed = True
            membership.date_joined = oldest_group_contribution_date
            membership.save()
            
            # Set the inactive and removed dates
            Membership.objects.filter(pk=membership.id).update(date_became_removed=newest_group_contribution_date, date_became_inactive=newest_group_contribution_date)

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0037_change-to-generic-address-lines'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='date_became_removed',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='membership',
            name='is_removed',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='membership',
            name='date_became_coordinator',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='membership',
            name='date_became_inactive',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.RunSQL([
            ("UPDATE users_membership SET date_became_inactive=NULL WHERE is_active=TRUE"),
            ("UPDATE users_membership SET date_became_coordinator=NULL WHERE is_coordinator=FALSE")
        ]),
        migrations.RunPython(add_missing_memberships)
    ]
