from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from userprofile.views import valid_users

urlpatterns = patterns('',

    # Demo FrontPage$
    (r'^$', direct_to_template, {'extra_context': { 'users': valid_users }, 'template': 'front.html' }),

    # Account application
    (r'^accounts/', include('account.urls')),

    # Profile application
    (r'^profile/', include('userprofile.urls')),

    # Serves media content. WARNING!! Only for development uses. On production use lighthttpd for media content.
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': '../media/'}),


    # Admin (not really needed)
    (r'^admin/', include('django.contrib.admin.urls')),

)
