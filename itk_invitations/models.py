from pdb import set_trace as bp
from django.db import models
from django.template import Template, Context
from django.urls import reverse
from django.utils import timezone
from django.contrib import admin
from django.contrib.auth.models import Group, User
#from email.MIMEImage import MIMEImage
from email.mime.image import MIMEImage
from django.conf import settings
from django.utils.crypto import get_random_string

from localflavor.us.models import PhoneNumberField

import datetime
import os
#import urllib.request
from django.core.files.storage import default_storage

from communications.utilities import compose_email, safe_send_email

from users.models import Membership
from groups.email_text_utils import get_member_invitation_subject, get_member_invitation_body, get_admin_invitation_subject, get_admin_invitation_body, get_founder_invitation_subject, get_founder_invitation_body

from groups.email_text_utils import max_subject_length
from groups.models import StatusChange, status_change_values

# Currently, requires an email. Eventually would like to extend this
# model to accept either a phone_number or an email, so some invitees
# can be invited by text messages if that is their preferred form
# of communication

class UnregisteredUser(models.Model):
    """ Information entered in invitation about user """
    first_name = models.CharField(max_length=30, blank=True)
    middle_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField()
    phone_number = PhoneNumberField(blank=True)

class InvitationMessage(models.Model):
    """ One message may be shared with by several invitations """
    subject = models.CharField(max_length=max_subject_length, blank=True)
    message = models.TextField(blank=True)

class Invitation(models.Model):
    """ All-Purpose invitation: group_member, group_coordinator, group_founder """
    """A invitation to join a Loop to be sent by email (or possibly text)"""
    BECOME_GROUP_MEMBER = '1'
    BECOME_GROUP_COORDINATOR = '2'
    START_GROUP_FROM_USER = '3'
    START_GROUP_FROM_UNREGISTERED_USER = '4'

    INVITATION_CHOICES = (
        (BECOME_GROUP_MEMBER, 'Become_Group_Member'),
        (BECOME_GROUP_COORDINATOR, 'Become_Group_Coordinator'),
        (START_GROUP_FROM_USER, 'Start_Group_From_User'),
        (START_GROUP_FROM_UNREGISTERED_USER, 'Start_Group_From_Unregistered_User'))

    invitation_type = models.CharField(max_length=1, choices=INVITATION_CHOICES)

    key = models.CharField(max_length=64, unique=True)
    # group will be None when invitation is to be a group founder
    group = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)
    inviter = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='inviter', blank=True, null=True)
    # If invitation is from an unregistered user (through the landing page)
    unregistered_inviter = models.ForeignKey(UnregisteredUser, on_delete=models.SET_NULL, related_name='unregistered_inviter', blank=True, null=True)
    # invitee is initially an UnregisteredUser
    invitee = models.ForeignKey(UnregisteredUser, on_delete=models.SET_NULL, related_name='invitee', blank=True, null=True)
    # when or if invitee accepts invitation he/she becomes a User rather than an UnregisteredUser
    confirmed_invitee = models.ForeignKey(User, related_name='confirmed_invitee', on_delete=models.SET_NULL, blank=True, null=True)
#    is_coordinator = models.BooleanField (default=False)
    invitation_message = models.ForeignKey(InvitationMessage, on_delete=models.SET_NULL, blank=True, null=True)
    sent_timestamp = models.DateTimeField(blank=True, null=True)
    read_email_timestamp = models.DateTimeField(blank=True, null=True)
    first_visit_timestamp = models.DateTimeField(blank=True, null=True)
    response_timestamp = models.DateTimeField(blank=True, null=True)
    number_of_visits = models.IntegerField(default=0)
    is_accepted = models.BooleanField(default=False)
    is_declined = models.BooleanField(default=False)
    response_message = models.TextField(blank=True)

    # See https://docs.djangoproject.com/en/1.11/ref/models/instances/#creating-objects
    @classmethod
    def create(cls, invitation_type, invitee, invitation_message, group=None,
               inviter=None, unregistered_inviter=None):
        key = get_random_string(64).lower()

        #check type of invitee
        if isinstance (invitee, UnregisteredUser):
            invitation = cls(key=key, invitation_type=invitation_type, group=group, inviter=inviter, unregistered_inviter=unregistered_inviter, invitee=invitee, invitation_message=invitation_message)
        elif isinstance (invitee, User):
            unregistered_invitee = UnregisteredUser (first_name = invitee.first_name,
                                                     middle_name = invitee.person.middle_name,
                                                     last_name = invitee.last_name,
                                                     email = invitee.email,
                                                     phone_number = invitee.person.phone_number)
            unregistered_invitee.save()
            invitation = cls(key=key, invitation_type=invitation_type, group=group, inviter=inviter, unregistered_inviter=unregistered_inviter, invitee=unregistered_invitee, confirmed_invitee=invitee, invitation_message=invitation_message)

        invitation.save()

        return invitation


    def accept(self, user):
        """Update invitation status when invitation ia accepted"""

        # If invitation is to a group, assign user to that group

        if (self.invitation_type == Invitation.BECOME_GROUP_MEMBER or
            self.invitation_type == Invitation.BECOME_GROUP_COORDINATOR):

            if self.invitation_type != Invitation.BECOME_GROUP_MEMBER:
                is_coordinator = True
            else:
                is_coordinator = False

            # See if user is already a member of this group
            try:
                # If so, member is probably being promoted to 'coordinator'
                membership = Membership.objects.get(user=user,
                                                  group=self.group)
            except:
                membership = None


            if membership:
                if is_coordinator and not membership.is_coordinator:
                    # promote user to coordinator
                    if membership.is_active:

                        sc=StatusChange(user=user, group=self.group,
                                        status_change=status_change_values['MEMBER_TO_ADMIN'],
                                        is_initiated_by_user=False)

                        sc.save()

                    membership.is_coordinator = is_coordinator
                    membership.save()
                elif membership.is_removed:
                    membership.is_active = True
                    membership.is_removed = False
                    membership.date_became_removed = None
                    user.groups.add(self.group.id)
                    user.save()
                    membership.save()
                    print(membership.is_removed)
                else:
                    print ("Duplicate Invitation not caught")
                    raise
            else:
                membership=Membership(user=user,
                                        group=self.group,
                                        date_joined=datetime.datetime.now(),
                                        is_coordinator=is_coordinator)
                 # Add link from user to group
                user.groups.add(self.group.id)
                user.save()
            
            membership.save()


        self.is_accepted = True
        self.response_timestamp = timezone.now()
        self.confirmed_invitee=user
        self.save()

        # Since user is now registered, delete record as UnregisteredUser
        invitee=self.invitee
        invitee.delete()


    def decline(self, message):
        """Update invitation status when invitation is declined"""

        self.response_message = message
        self.is_declined = True
        self.response_timestamp = timezone.now()
        self.save()


    def send(self, request):
        # Add name of recipient

        invitation_url = '/invitation/' + self.key + '/'
        invitation_url = request.build_absolute_uri(invitation_url)

        read_receipt_url = reverse('api_v1:invitation-read-receipt.png')
        read_receipt_url = request.build_absolute_uri(read_receipt_url)
        read_receipt_url = read_receipt_url + '?id=' + str(self.id)

        personal_message = self.invitation_message.message

        if self.invitation_type == Invitation.BECOME_GROUP_COORDINATOR:
            self.invitation_message.subject = get_admin_invitation_subject(user=request.user, group=self.group)

            message_body = get_admin_invitation_body(request, user=request.user, group=self.group, invitee_first_name=self.invitee.first_name, url=invitation_url,
                                                     optional_message=personal_message, invitation_id=self.id, read_receipt_url=read_receipt_url)

        elif self.invitation_type == Invitation.BECOME_GROUP_MEMBER:
            self.invitation_message.subject = get_member_invitation_subject(user=request.user, group=self.group)

            message_body = get_member_invitation_body(request, user=request.user, group=self.group, invitee_first_name=self.invitee.first_name, url=invitation_url,
                                                      optional_message=personal_message, is_disabled_button=False, invitation_id=self.id, read_receipt_url=read_receipt_url)

        elif self.invitation_type == START_GROUP_FROM_USER:
            self.invitation_message.subject = get_founder_invitation_subject(user=request.user, group=self.group)

            message_body = get_founder_invitation_body(request, user=request.user, group=self.group, invitee_first_name=self.invitee.first_name, url=invitation_url,
                                                       optional_message=personal_message, invitation_id=self.id, read_receipt_url=read_receipt_url)


        self.invitation_message.message = message_body.replace("\r\n", "<br />")

        email = compose_email(self.invitation_message.subject, self.invitation_message.message)
        email.extra_headers.update({'Content-ID': '<Loopla_Logo.png>'})
        email.to.append(self.invitee.email)

        # If we want to attach an actual image, we uncomment the following
        # two lines
        #fd = default_storage.open ('logos/Loopla_logo_01_112x30.png', 'rb')
        #email.attach('Loopla_Logo.png', fd.read(), 'img/png')

        safe_send_email(email)

        self.sent_timestamp = timezone.now()

        self.invitation_message.save()
        self.save()
admin.site.register(Invitation)

class MultiUseInvitation(models.Model):
    key = models.CharField(max_length=64, unique=True)
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    is_visible = models.BooleanField(default=True)

    def accept(self, user):
        """Update invitation status when invitation ia accepted"""

        # If invitation is to a group, assign user to that group
        # See if user is already a member of this group
        try:
            # If so, member is probably being promoted to 'coordinator'
            membership = Membership.objects.get(user=user,
                                                group=self.group)
        except:
            membership = None


        if membership:
            return
        else:
            membership = Membership(user=user,
                                    group=self.group,
                                    date_joined=datetime.datetime.now(),
                                    is_coordinator=False)
                # Add link from user to group
            user.groups.add(self.group.id)
            user.save()
            membership.save()
            multi_use_invitation_user = MultiUseInvitationUsers(multi_use_invitation=self, group=self.group, user=user)
            multi_use_invitation_user.save()

        self.save()


class MultiUseInvitationUsers(models.Model):
    multi_use_invitation = models.ForeignKey(MultiUseInvitation, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)