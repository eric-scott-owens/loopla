# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-28 21:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0012_auto_20170726_1458'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coordinatornomination',
            name='group',
        ),
        migrations.RemoveField(
            model_name='coordinatornomination',
            name='nomination_ptr',
        ),
        migrations.RemoveField(
            model_name='coordinatornominationvisit',
            name='coordinator_nomination',
        ),
        migrations.RemoveField(
            model_name='invitationvisit',
            name='invitation',
        ),
        migrations.RemoveField(
            model_name='nomination',
            name='confirmed_nominee',
        ),
        migrations.RemoveField(
            model_name='nomination',
            name='nomination_message',
        ),
        migrations.RemoveField(
            model_name='nomination',
            name='nominator',
        ),
        migrations.RemoveField(
            model_name='nomination',
            name='nominee',
        ),
        migrations.RemoveField(
            model_name='nominationvisit',
            name='nomination',
        ),
        migrations.RemoveField(
            model_name='invitation',
            name='is_coordinator',
        ),
        migrations.AddField(
            model_name='invitation',
            name='invitation_type',
            field=models.CharField(choices=[('1', 'Become_Group_Member'), ('2', 'Become_Group_Coordinator'), ('3', 'Start_Group_From_User'), ('4', 'Start_Group_From_Unregistered_User')], default='1', max_length=1),
        ),
        migrations.AddField(
            model_name='invitation',
            name='number_of_visits',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='invitation',
            name='unregistered_inviter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='unregistered_inviter', to='itk_invitations.UnregisteredUser'),
        ),
        migrations.AlterField(
            model_name='invitation',
            name='invitee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invitee', to='itk_invitations.UnregisteredUser'),
        ),
        migrations.DeleteModel(
            name='CoordinatorNomination',
        ),
        migrations.DeleteModel(
            name='CoordinatorNominationVisit',
        ),
        migrations.DeleteModel(
            name='InvitationVisit',
        ),
        migrations.DeleteModel(
            name='Nomination',
        ),
        migrations.DeleteModel(
            name='NominationMessage',
        ),
        migrations.DeleteModel(
            name='NominationVisit',
        ),
    ]
