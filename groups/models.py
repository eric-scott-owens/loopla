import json
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import Group, User
from localflavor.us.models import USStateField

class Circle(models.Model):
    """ Additional information associated with a group """
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    city = models.CharField(max_length=80, blank=True)
    state = USStateField(blank=True)
    description = models.TextField()
    guidelines =  models.TextField(blank=True)
    group_photo = models.ImageField(upload_to='group_photos', null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)
    name = models.CharField(max_length=80)
    user_references = models.TextField(default='[]')
    user_count = models.PositiveIntegerField(default=0)

    def get_user_references(self):
        user_references = json.loads(self.user_references)
        return user_references

    def set_user_references(self, user_references):        
        user_references_json = json.dumps(user_references, default=str)
        self.user_references = user_references_json
        self.user_count = len(user_references)

    def add_user_to_references(self, user):
        user_references = self.get_user_references()
        matching_indices = [i for i,x in enumerate(user_references) if x['id'] == user.id]
        if len(matching_indices) == 0:
            user_reference = {
                'id': user.id,
                'newest_update': user.person.newest_update
            }
            user_references.append(user_reference)
            self.set_user_references(user_references)

    def remove_user_from_references(self, user):
        user_references = self.get_user_references()
        matching_indices = [i for i,x in enumerate(user_references) if x['id'] == user.id]
        if len(matching_indices) > 0:
            matching_indices.reverse()
            for index in matching_indices:
                del user_references[index]
            self.set_user_references(user_references)

status_change_values = {
    'ADMIN_TO_MEMBER': '1',
    'ADMIN_TO_INACTIVE': '2',
    'REMOVE_ADMIN': '3',
    'MEMBER_TO_ADMIN': '4',
    'MEMBER_TO_INACTIVE': '5',
    'REMOVE_MEMBER': '6',
#    'INACTIVE_TO_ADMIN': '7',
    'INACTIVE_TO_MEMBER': '8',
    'REMOVE_INACTIVE': '9',
}

STATUS_CHANGE_CHOICES = (
    (status_change_values['ADMIN_TO_MEMBER'], 'admin_to_member' ),
    (status_change_values['ADMIN_TO_INACTIVE'], 'admin_to_inactive'),
    (status_change_values['REMOVE_ADMIN'], 'remove_admin'),
    (status_change_values['MEMBER_TO_ADMIN'], 'member_to_admin'),
    (status_change_values['MEMBER_TO_INACTIVE'], 'member_to_inactive'),
    (status_change_values['REMOVE_MEMBER'], 'remove_member'),
#    (status_change_values['INACTIVE_TO_ADMIN'], 'inactive_to_admin'),
    (status_change_values['INACTIVE_TO_MEMBER'], 'inactive_to_member'),
    (status_change_values['REMOVE_INACTIVE'], 'remove_inactive'),
)

class StatusChange(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    status_change = models.CharField(max_length=2, choices=STATUS_CHANGE_CHOICES)
    note = models.TextField(blank=True)
    # Alternatively, it would be initiated by an admin
    is_initiated_by_user = models.BooleanField()
    date = models.DateTimeField(auto_now_add=True)
admin.site.register(StatusChange)
