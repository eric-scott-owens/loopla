#!/usr/bin/env python
import os
import sys
from pdb import set_trace as bp
from django.urls import reverse
from django.core.management.base import BaseCommand, CommandError
from email.mime.image import MIMEImage
from django.conf import settings
from django.contrib.auth.models import User, Group
from users.models import Membership
from itk_invitations.models import Invitation
from dashboard.models import Post, Comment, ShortList
from users.models import SummaryPreferences
from datetime import datetime, timedelta
from django.utils import timezone
from communications.utilities import compose_email, safe_send_email


class Command(BaseCommand):

    def generate_cutoff_date(self):
        current_date = timezone.now()
        cutoff = current_date - timedelta(hours=24)
        return cutoff

    def get_new_posts_for_loop(self, current_loop, cutoff_date):
        return_posts = Post.objects.filter(group=current_loop, date_added__gt=cutoff_date, is_deleted=False).order_by('-date_added')
        for post in return_posts:
            post.url = '%s/posts/%d/' % (settings.BASE_URL, post.id)
        return return_posts

    def get_new_comments_for_loop(self, current_loop, cutoff_date):
        all_posts_with_new_comment = Post.objects.filter(group=current_loop, comments__date_added__gt=cutoff_date, is_deleted=False).distinct('id')
        # filter out posts to only keep ones in the last day/week (depending on the type of summary)
        posts_with_comments = []
        total_comments = 0
        for post in all_posts_with_new_comment: 
            num_comments_on_post = Comment.objects.filter(post=post, date_added__gt=cutoff_date, is_deleted=False).count()
            post.num_comments_on_post = num_comments_on_post
            post.url = '%s/posts/%d/' % (settings.BASE_URL, post.id)
            total_comments = total_comments + num_comments_on_post
            posts_with_comments.append(post)

        return posts_with_comments, total_comments

    def send_email(self, summary_content):
        subject = "Your Daily Update From Loopla"
        context = {'summary_content': summary_content, 'user_id' : summary_content['user'].id}
        email = compose_email(subject, "email_summary.html", context)
        email.to.append(summary_content['user'].email)
        safe_send_email(email)


    def handle(self, *args, **options):
        cutoff_date = self.generate_cutoff_date()
        users = User.objects.all()
        
        for user in users:
          groups = user.groups.all()
          new_content_to_show = False
          user.url = '%s/users/%d/' % (settings.BASE_URL, user.id)

          summary_content = {
              'user': user,
              'groups': []
              }

          send_email_to_user = False

          for group in groups:
            user_prefs = SummaryPreferences.objects.get(user_id=user.id, group_id=group.id)
            if (user_prefs.send_daily_summary): 
                send_email_to_user = True
                #get all new post info
                group.posts = self.get_new_posts_for_loop(group, cutoff_date)
                group.n_new_posts = len(group.posts)

                #get all new comment info
                group.posts_with_comments, total_comments = self.get_new_comments_for_loop(group, cutoff_date)
                group.n_new_comments = total_comments
                
                group.url = '%s/loop/%d/dashboard' % (settings.BASE_URL, group.id)

                if(group.n_new_comments != 0 or group.n_new_posts != 0):
                    summary_content['groups'].append(group)
                    new_content_to_show = True

          if (send_email_to_user==True and new_content_to_show==True):
            self.send_email(summary_content)