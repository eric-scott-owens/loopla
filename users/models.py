from django.db import models
from django.contrib import admin
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill, Transpose
from django.contrib.auth.models import User, Group
from django.utils.crypto import get_random_string
from groups.models import Circle
from phonenumber_field.modelfields import PhoneNumberField as TelephoneNumberField

from localflavor.us.models import PhoneNumberField, USStateField, USZipCodeField
import datetime

class Person(models.Model):
    """ Additional information to describe a user, particularly items for user's profile """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    middle_name =  models.CharField(max_length=30, blank=True)

    # Sometimes the meta data for image orientation is messed up
    # Here's the fix implemented below: https://stackoverflow.com/questions/17385574/stopping-auto-rotation-of-images-in-django-imagekit-thumbnail
    photo = ProcessedImageField(upload_to='profile_photos',
                                processors=[Transpose(), ResizeToFill(500, 500)],
                                format='JPEG',
                                options={'quality': 85},
                                null=True,
                                blank=True)
    
    telephone_number = TelephoneNumberField(blank=True, null=True)
    address_line_1 = models.CharField(max_length=80, blank=True)
    address_line_2 = models.CharField(max_length=80, blank=True)
    address_line_3 = models.CharField(max_length=80, blank=True)
    city = models.CharField(max_length=80, blank=True)
    state = USStateField(blank=True)
    zipcode = USZipCodeField(blank=True)
    
    newest_update = models.DateTimeField(auto_now=True)
    biography = models.CharField(max_length=100, blank=True, null=True)
    can_create_loops = models.BooleanField(default=False)

class Membership(models.Model):
    """ Relationship between User and any Group he/she belongs to """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date_joined = models.DateField(auto_now_add=True)
    is_founder = models.BooleanField (default=False)
    is_coordinator = models.BooleanField (default=False)
    is_active = models.BooleanField (default=True)
    is_removed = models.BooleanField (default=False)
    date_became_inactive = models.DateField(blank=True, null=True)
    date_became_removed = models.DateField(blank=True, null=True)
    date_became_coordinator = models.DateField(blank=True, null=True)
    user_engagement_section_dismissed = models.BooleanField(default=False)
    date_first_posted = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            # This code only happens if the objects is
            # not in the database yet. Otherwise it would
            # have pk
            SummaryPreferences.objects.create(
                send_daily_summary = False,
                send_weekly_summary = True,
                user = self.user,
                group = self.group
            )
            
        super(Membership, self).save(*args, **kwargs)
        
        circle = Circle.objects.get(group__id=self.group_id)
        user = User.objects.get(pk=self.user_id)
        
        if self.is_active:
            circle.add_user_to_references(user)
        else:
            circle.remove_user_from_references(user)

        circle.save()

    def delete(self, *args, **kwargs):
        super(Membership, self).save(*args, **kwargs)
        circle = Circle.objects.get(group__id=self.group_id)
        user = User.objects.get(pk=self.user_id)
        circle.remove_user_from_references(user)
        circle.save()

NOTIFICATION_METHOD_CHOICES = (
    ('0', 'none'),
    ('1', 'email'),
    ('2', 'text'),
    ('3', 'text_and_email'),
)

NOTIFICATION_FREQUENCY_CHOICES = (
    ('0', 'none'),
    ('1', 'weekly'),
    ('2', 'daily'),
    ('3', 'immediately'),
)

class PrivacyPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="privacy_preferences")
    is_share_address = models.BooleanField (default=False)
    is_share_email   = models.BooleanField (default=False)
    is_share_phone   = models.BooleanField (default=False)
admin.site.register(PrivacyPreferences)

class NotificationPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="notification_preferences")
    notify_by_email = models.BooleanField(default=False)
    notify_by_text = models.BooleanField(default=False)
admin.site.register(NotificationPreferences)

class SummaryPreferences(models.Model):
    send_daily_summary = models.BooleanField(default=True)
    send_weekly_summary = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="summary_preferences", null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="summary_preferences", null=True)

    class Meta: 
        unique_together = ('user', 'group')

admin.site.register(SummaryPreferences)


class Tokens(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    create_loop = models.PositiveIntegerField(default=0)
    nominate_founder = models.PositiveIntegerField(default=0)
    give_kudos = models.PositiveIntegerField(default=20)


class ToursTaken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="tours_taken")
    dashboard_tour_date = models.DateTimeField(blank=True, null=True)
    post_editor_tour_date = models.DateTimeField(blank=True, null=True)