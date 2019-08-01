from django.db import models
from django.contrib import admin
from users.models import User
from dashboard.models import Post, Comment, ShortList
from itk_invitations.models import Invitation
ACTION_CHOICES = (
    ('000' , 'null'),
    ('001' , 'login'),            # from users/views.py
    ('002' , 'logout'),           #navbar
    ('003' , 'feedback_form'),     #navbar
    ('004' , 'forgot_password'),
    ('005' , 'submit_feedback'),     #feedback modal
    ('006' , 'register'),     # from users/views.py
    ('010' , 'dashboard_v1'),
    ('011' , 'dashboard_v2'),  # from navbar
    ('012' , 'show_post_v1'),
    ('013' , 'show_post_v2'), # from showPost()
    ('014' , 'give_post_kudos'),  # server-side: appreciate_post()
    ('015' , 'give_comment_kudos'), # server-side: appreciate_comment()
    ('016' , 'comment_form'),
    ('017' , 'submit_comment'),  #showpost modal
    ('018' , 'entered_business_comment'),
    ('019' , 'entered_manual_tag_comment'),
    ('020' , 'create_post_form'), # from dashboard_v_1_2
    ('021' , 'submit_post'),  #from modal
    ('022' , 'entered_business_post'),
    ('023' , 'entered_manual_tag_post'),
    ('024' , 'uploaded_photo'),
    ('025' , 'show_post_to_profile'),
    ('026' , 'give_kudos'), # server-side: appreciate_post(), appreciate_comment()
    ('040' , 'short_list'), #from navbar
    ('041' , 'short_list_form'), #from short_list
    ('042' , 'submit_short_list'), #modal
    ('043' , 'entered_business_post'),
    ('044' , 'entered_manual_tag_post'),
    ('045' , 'edit_short_list'), #from my short list
    ('046' , 'delete_short_list'), #from my short list
    ('050' , 'settings'), #from navbar
    ('051' , 'edit_profile_form'), # from edit_settings
    ('051' , 'edit_profile_submit'),
    ('060' , 'loops'),
    ('061' , 'edit_loop_status_form'),
    ('062' , 'submit_loop_status'),
    ('070' , 'privacy'),
    ('071' , 'changed_privacy'),
    ('080' , 'notifications'),
    ('081' , 'changed_notifications'),
    ('090' , 'about_loopla'),  # navbar
    ('091' , 'privacy_policy'), #navbar
    ('092' , 'kudos_exchange'), #navbar
    ('100' , 'form_a_loop_form'),
    ('101' , 'submit_form_a_loop'),
    ('102' , 'invite_member_navbar_form'),
    ('103' , 'submit_invite_member_navbar'),
    ('104' , 'loop_summary'), #from navbar?
    ('105' , 'edit_loop_description_form'),
    ('106' , 'submit_loop_description'),
    ('107' , 'loop_guidelines_form'),
    ('108' , 'submit_loop_guidelines'),
    ('109' , 'add_admin_from_summary_form'),
    ('110' , 'submmit_add_admin_from_summary'),
    ('111' , 'delete_loop_form'),
    ('112' , 'submit_delete_loop'),
    ('115' , 'loop_non_admin'),  # from navbar
    ('116' , 'loop_admin'),  # from navbar
    ('117' , 'loopla_guidelines'), # from loop_admin, loop_non_admin
    ('120' , 'loop_members'),
    ('121' , 'loop_members_to_profile'),
    ('122' , 'loop_manage_members'),
    ('123' , 'loop_manage_members_add_admin_form'),
    ('124' , 'submit_loop_manage_members_admin_form'),
    ('125' , 'note_loop_manage_members_admin_form'),
    ('126' , 'loop_manage_members_add_member_form'),
    ('127' , 'submit_loop_manage_members_member_form'),
    ('128' , 'note_loop_manage_members_member_form'),
    ('129' , 'loop_manage_members_edit_status_form'),
    ('130' , 'submit_loop_manage_members_edit_status'),
    ('131' , 'note_loop_manage_members_edit_status'),
    ('140' , 'loop_pending_invitations'),
    ('141' , 'loop_pending_invitations_add_admin_form'),
    ('142' , 'submit_loop_pending_invitations_admin_form'),
    ('143' , 'note_loop_pending_invitations_admin_form'),
    ('144' , 'loop_pending_invitations_add_member_form'),
    ('145' , 'submit_loop_pending_invitations_member_form'),
    ('146' , 'note_loop_pending_invitations_member_form'),
    ('150' , 'loop_declined_invitations'),
    ('160' , 'loop_status_changes'))


def get_action_code(action_name):
    action_index = [x[1] for x in ACTION_CHOICES].index(action_name)
    return ACTION_CHOICES[action_index][0]

# Simple Record for common actions
class SimpleAction(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    action =  models.CharField(max_length=3, choices=ACTION_CHOICES)
    class Meta:
        ordering = ["-date"]

    @staticmethod
    def log_simple_action(user, action_name):
        log_entry = SimpleAction()
        log_entry.user = user
        log_entry.action = get_action_code(action_name)
        log_entry.save()

admin.site.register(SimpleAction)

class NavigationAction(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    url = models.CharField(max_length=2083)
    previous_url = models.CharField(max_length=2083, blank=True, null=True)
    class Meta:
        ordering = ["-date"]
admin.site.register(NavigationAction)

# Notification-Worthy Actions

class ReceivedCommentToPost(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]

class ReceivedKudosToPost(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    sender = models.ForeignKey (User, related_name='kudos_sender_post',
                                on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]


class ReceivedKudosToComment(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    sender = models.ForeignKey (User, related_name='kudos_sender_comment',
                                on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]

class ReceivedKudosToShortList(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    short_list = models.ForeignKey(ShortList, on_delete=models.CASCADE)
    sender = models.ForeignKey (User, related_name='kudos_sender_short_list',
                                on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]

class SentKudosToPost(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]


class SentKudosToComment(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]

class SentKudosToShortList(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    short_list = models.ForeignKey(ShortList, on_delete=models.CASCADE)
    is_notified = models.BooleanField (default=False)
    class Meta:
        ordering = ["-date"]

class AcceptedGroupFounderNomination(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    nomination = models.ForeignKey (Invitation, on_delete=models.CASCADE)
    class Meta:
        ordering = ["-date"]

# Other Actions


class SentGroupFounderNomination(models.Model):
    user = models.ForeignKey (User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    nomination = models.ForeignKey (Invitation, on_delete=models.CASCADE)
    class Meta:
        ordering = ["-date"]
