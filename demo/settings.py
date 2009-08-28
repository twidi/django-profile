# Django settings for demo project.
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS
import os.path

DEBUG = True
TEMPLATE_DEBUG = DEBUG

PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

DATABASE_ENGINE = 'sqlite3'           # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
DATABASE_NAME = '%s/database.db' % PROJECT_PATH            # Or path to database file if using sqlite3.
DATABASE_USER = ''             # Not used with sqlite3.
DATABASE_PASSWORD = ''         # Not used with sqlite3.
DATABASE_HOST = ''             # Set to empty string for localhost. Not used with sqlite3.
DATABASE_PORT = ''             # Set to empty string for default. Not used with sqlite3.

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be avilable on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en'

AUTH_PROFILE_MODULE = 'demoprofile.profile'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.normpath(os.path.join(PROJECT_PATH, '../media/'))

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/site_media/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = '@@6g99inmvqmt+d786%msz1r(lap_)o+ammt*2)gf8b=w1@1s$'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',
#     'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.doc.XViewMiddleware',
)

ROOT_URLCONF = 'demo.urls'

# e-mail settings
DEFAULT_FROM_EMAIL = ''
EMAIL_HOST = ''
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_PATH, 'templates'),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.admin',
    'userprofile',
    'demoprofile',
)

TEMPLATE_CONTEXT_PROCESSORS += (
        "userprofile.context_processors.css_classes",
)

# START of django-profile specific options
I18N_URLS = False
DEFAULT_AVATAR = os.path.join(MEDIA_ROOT, 'userprofile/generic.jpg')
AVATAR_WEBSEARCH = True
# 127.0.0.1:8000 Google Maps API Key
GOOGLE_MAPS_API_KEY = "ABQIAAAA06IJoYHDPFMx4u3hTtaghxTpH3CbXHjuCVmaTc5MkkU4wO1RRhST5bKY_U7dUG1ZGu1S-n-ukXGNjQ"
# Haddock
#GOOGLE_MAPS_API_KEY="ABQIAAAA06IJoYHDPFMx4u3hTtaghxS1mGAeXhF8eEwoOC3WUqD9xSVHbhT_wvgbriWemZzoPwFT5-HqnLJ9-A"
REQUIRE_EMAIL_CONFIRMATION = False
AVATAR_QUOTA = 8

# Uncomment and fill the field above to activate GEOIP
#GEOIP_PATH = "%s/db/" % PROJECT_PATH

# Uncomment and fill the fields above to activa the S3 Storage backend
# S3 Storage Settings
#AWS_SECRET_ACCESS_KEY = ""
#AWS_ACCESS_KEY_ID = ""
#AWS_STORAGE_BUCKET_NAME = "avatar-test"
#from S3 import CallingFormat
#AWS_CALLING_FORMAT = CallingFormat.SUBDOMAIN
# END of django-profile specific options
