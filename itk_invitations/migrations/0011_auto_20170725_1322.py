# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-25 13:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('itk_invitations', '0010_auto_20170724_1906'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Coordinator_Nomination',
            new_name='CoordinatorNomination',
        ),
        migrations.RenameModel(
            old_name='Coordinator_Nomination_Visit',
            new_name='CoordinatorNominationVisit',
        ),
        migrations.RenameModel(
            old_name='Invitation_Visit',
            new_name='InvitationVisit',
        ),
        migrations.RenameModel(
            old_name='Nomination_Visit',
            new_name='NominationVisit',
        ),
    ]
