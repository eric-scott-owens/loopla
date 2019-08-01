
from django.conf.urls import url

from . import views

urlpatterns = [
    # Let React Router handle the url routing.
    url(r'.*', views.index, name='index'),
]
