import sys
from datetime import timedelta

from conf.common.settings import *

DEBUG = True

ALLOWED_HOSTS = ['*']
SECRET_KEY = 'w*ea%hd29u-&l&rol@5zo8a+@5o=@wb+i*r(@_+fnuc!*^9o0w'

# SECURE_SSL_REDIRECT = True
# CSRF_COOKIE_SECURE = True

"""
JWT Tokens settings """
REST_FRAMEWORK.update({
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    )
})

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=6),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,

    'ALGORITHM': 'HS256',
    "SIGNING_KEY": SECRET_KEY,
    'ISSUER': 'PMDragon API',
}

"""
Django rest framework cors headers """
CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'conf.development.urls'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
MEDIA_URL = "/media/"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': '5432',
    },
}

if 'test' in sys.argv or 'test_coverage' in sys.argv:
    DATABASES.update({
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'test_database.sqlite3'
        }
    })

"""
Email settings use console backend to output email in console """
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_SUBJECT_PREFIX = '[PmDragon] '
