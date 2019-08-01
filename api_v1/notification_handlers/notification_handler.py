import copy
from django.contrib.auth.models import User, Group
from dashboard.models import Post, Comment
from django.conf import settings
from communications.utilities import compose_email, safe_send_email, safe_send_text

def send_email_notification(message, recipient):
  context = {'message_context': message, 'user_id': message['recipient_id']}
  
  if(message['notification_type'] == 'post'):
    subject = message['poster_first_name'] + ' ' + message['poster_last_name'] + ' just posted in ' + message['group_name']
  else:
    subject = message['commenter_first_name'] + ' ' + message['commenter_last_name'] + ' commented on ' + message['post_summary']

  email = compose_email(subject, "email_notification.html", context)
  email.to.append(recipient)
  safe_send_email(email)

def send_post_notification_with_worker(data, poster):
  print('in send with worker')
  if (settings.NOTIFICATIONS_ENABLED):
    try:
      group_id = data['group']
      group = Group.objects.get(pk=group_id)
      group_name = group.circle.name
      post_summary = data['summary']
      url = settings.BASE_URL + '/posts/' + str(data['id'])
      message = poster.first_name + ' just posted \"' + post_summary + '\" to ' + group_name + '. ' + url

      if len(message) > 126:
        temp_post_summary = post_summary
        temp_group_name = group_name
        if(len(post_summary) + len(group_name) >= 74):
          if(len(post_summary) >= 37):
            temp_post_summary = post_summary[0:34] + "..." 
          if(len(group_name) >= 37):
            temp_group_name = group_name[0:34] + "... "
        message = poster.first_name + ' just posted \"' + temp_post_summary + '\" to ' + temp_group_name + url


      users = User.objects.filter(groups__id=group_id)
      
      email_message = {
        'poster_first_name': poster.first_name,
        'poster_last_name': poster.last_name,
        'group_name': group_name,
        'post_summary': post_summary,
        'notification_type': 'post',
        'post_url': url,
        'poster_id': poster.id,
        'BASE_URL': settings.BASE_URL,
        'EMAIL_SITE_RESOURCES_URL' : settings.EMAIL_SITE_RESOURCES_URL
        }

      for user in users:
          email_message['recipient_id'] = user.id
          if((user.id != poster.id) and user.person.telephone_number and user.notification_preferences.notify_by_text):
              safe_send_text(message=message, recipient=[user.person.telephone_number.as_e164])
          if((user.id != poster.id) and user.email and user.notification_preferences.notify_by_email):
              send_email_notification(message=email_message, recipient=user.email)

    except Exception as e:
      print(e.args)


def send_comment_notification_with_worker(data, commenter, post_id):
  print('in send comment with worker')
  if (settings.NOTIFICATIONS_ENABLED):
    try:
      user_ids_to_notify = []
      post = Post.objects.get(pk=post_id)
      post_summary = post.summary
      post_owner_id = post.owner_id
      url = settings.BASE_URL + '/posts/' + str(post_id)
      message = commenter.first_name + ' just commented on \"' + post_summary + '\" ' + url
      poster = User.objects.get(id=post_owner_id)
      other_comments = Comment.objects.filter(post_id=post_id)
      group = Group.objects.get(pk=post.group.id)
      group_name = group.circle.name

      if len(message) > 126:
        temp_post_summary = post_summary
        if(len(post_summary) >= 65):
          temp_post_summary = post_summary[0:64] + "... " 
        message = commenter.first_name + ' just commented on \"' + post_summary + '\" ' + url

      for comment in other_comments:
          if(comment.owner_id != commenter.id):
              if comment.owner_id not in user_ids_to_notify:
                  user_ids_to_notify.append(comment.owner_id)
                  
      if(post_owner_id != commenter.id):
          if post_owner_id not in user_ids_to_notify:
              user_ids_to_notify.append(post_owner_id) 

      email_message = {
        'commenter_first_name': commenter.first_name,
        'commenter_last_name': commenter.last_name,
        'group_name': group_name,
        'post_summary': post_summary,
        'notification_type': 'comment',
        'post_url': url,
        'poster_id': poster.id,
        'BASE_URL': settings.BASE_URL,
        'EMAIL_SITE_RESOURCES_URL' : settings.EMAIL_SITE_RESOURCES_URL
        }

      for user_id in user_ids_to_notify:
          user = User.objects.get(pk=user_id)
          email_message['recipient_id'] = user.id
          if(user.person.telephone_number and user.notification_preferences.notify_by_text):
              safe_send_text(message=message, recipient=[user.person.telephone_number.as_e164])
          if(user.email and user.notification_preferences.notify_by_email):
              send_email_notification(message=email_message, recipient=user.email)

    except Exception as e:
      print(e.args)