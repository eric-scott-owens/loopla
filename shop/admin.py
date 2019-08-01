from django.contrib import admin
from shop.models import CatalogItem, Kudos, Collection
# Register your models here.

class CatalogItemAdmin(admin.ModelAdmin):
     filter_horizontal = ('kudos','collection') #If you don't specify this, you will get a multiple select widget.

admin.site.register(Kudos)
admin.site.register(Collection)
admin.site.register(CatalogItem, CatalogItemAdmin)
