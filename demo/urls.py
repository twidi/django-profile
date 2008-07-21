from django.conf.urls.defaults import *
from django.contrib import admin
from django.views.generic.simple import direct_to_template
from django.conf import settings
from userprofile.views import get_profiles

admin.autodiscover()

urlpatterns = patterns('',

    # Demo FrontPage$
    (r'^$', direct_to_template, {'extra_context': { 'profiles': get_profiles }, 'template': 'front.html' }),

    # Profile application
    (r'^accounts/', include('userprofile.urls')),

    # Admin (not really needed)
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/(.*)', admin.site.root),
)

# Serves media content. WARNING!! Only for development uses.
# On production use lighthttpd for media content.
if settings.DEBUG:

    # Delete the first trailing slash, if any.
    if settings.MEDIA_URL.startswith('/'):
        media_url = settings.MEDIA_URL[1:]
    else:
        media_url = settings.MEDIA_URL

    # Add the last trailing slash, if have not.
    if not media_url.endswith('/'):
        media_url = media_url + '/'

    urlpatterns += patterns('',
        (r'^' + media_url + '(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}
        ),
    )
