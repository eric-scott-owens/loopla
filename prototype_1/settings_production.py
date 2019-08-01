# Settings that are unique for server hosted on Heroku

from prototype_1.settings_shared import *

ALLOWED_HOSTS = ['','']

# specifies HTTPS protocol
SECURE_SSL_REDIRECT = True

SITE_ID = 3
