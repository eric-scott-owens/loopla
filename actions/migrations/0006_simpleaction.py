# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-02-16 01:19
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('actions', '0005_receivedkudostoshortlist_sentkudostoshortlist'),
    ]

    operations = [
        migrations.CreateModel(
            name='SimpleAction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('action', models.CharField(choices=[('001', 'login'), ('002', 'logout'), ('003', 'feedback_form'), ('004', 'forgot_password'), ('005', 'submit_feedback'), ('010', 'dashboard_v1'), ('011', 'dashboard_v2'), ('012', 'show_post_v1'), ('013', 'show_post_v2'), ('014', 'give_post_kudos'), ('015', 'give_comment_kudos'), ('016', 'comment_form'), ('017', 'submit_comment'), ('018', 'entered_business_comment'), ('019', 'entered_manual_tag_comment'), ('020', 'create_post_form'), ('021', 'submit_post'), ('022', 'entered_business_post'), ('023', 'entered_manual_tag_post'), ('024', 'uploaded_photo'), ('025', 'show_post_to_profile'), ('040', 'short_list'), ('041', 'short_list_form'), ('042', 'submit_short_list'), ('043', 'entered_business_post'), ('044', 'entered_manual_tag_post'), ('050', 'settings'), ('051', 'edit_profile_form'), ('051', 'edit_profile_submit'), ('060', 'loops'), ('061', 'edit_loop_status_form'), ('062', 'submit_loop_status'), ('070', 'privacy'), ('071', 'changed_privacy'), ('080', 'notifications'), ('081', 'changed_notifications'), ('090', 'about_loopla'), ('091', 'privacy_policy'), ('092', 'kudos_exchange'), ('100', 'form_a_loop_form'), ('101', 'submit_form_a_loop'), ('102', 'invite_member_navbar form'), ('103', 'submit_invite_member_navbar'), ('104', 'loop_summary'), ('105', 'edit_loop_description_form'), ('106', 'submit_loop_description'), ('107', 'loop_guidelines_form'), ('108', 'submit_loop_guidelines'), ('109', 'add_admin_from_summary_form'), ('110', 'submmit_add_admin_from_summary'), ('111', 'delete_loop_form'), ('112', 'submit_delete_loop'), ('120', 'loop_members'), ('121', 'loop_members_to_profile'), ('122', 'loop_manage_members'), ('123', 'loop_manage_members_add_admin_form'), ('124', 'submit_loop_manage_members_admin_form'), ('125', 'note_loop_manage_members_admin_form'), ('126', 'loop_manage_members_add_member_form'), ('127', 'submit_loop_manage_members_member_form'), ('128', 'note_loop_manage_members_member_form'), ('129', 'loop_manage_members_edit_status_form'), ('130', 'submit_loop_manage_members_edit_status'), ('131', 'note_loop_manage_members_edit_status'), ('140', 'loop_pending_invitations'), ('141', 'loop_pending_invitations_add_admin_form'), ('142', 'submit_loop_pending_invitations_admin_form'), ('143', 'note_loop_pending_invitations_admin_form'), ('144', 'loop_pending_invitations_add_member_form'), ('145', 'submit_loop_pending_invitations_member_form'), ('146', 'note_loop_pending_invitations_member_form'), ('150', 'loop_declined_invitations'), ('160', 'loop_status_changes')], max_length=3)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]