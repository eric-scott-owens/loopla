from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from users.models import Person

# Register your models here.
class ProfileInline(admin.StackedInline):
  model = Person
  can_delete = False
  verbose_name_plural = 'Profile'
  fk_name = 'user'

class CustomerUserAdmin(UserAdmin):
  inlines = (ProfileInline, )

  def get_inline_instances(self, request, obj=None):
    if not obj:
      return list()
    return super(CustomerUserAdmin, self).get_inline_instances(request, obj)

admin.site.unregister(User)
admin.site.register(User, CustomerUserAdmin)