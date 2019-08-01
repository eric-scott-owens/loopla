release: python manage.py migrate
web: gunicorn prototype_1.wsgi --log-file -
worker: python manage.py rqworker