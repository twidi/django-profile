from django.conf.urls.defaults import *

urlpatterns = patterns('',

    # Demo FrontPage
    (r'^$', "demo.views.front", {'template': 'front.html' }),

    # Account application
    (r'^accounts/', include('account.urls')),

    # Profile application
    (r'^profile/', include('profile.urls')),

    # Serves media content. WARNING!! Only for development uses. On production use lighthttpd for media content.
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': '../media/'}),


    # Admin (not really needed)
    (r'^admin/', include('django.contrib.admin.urls')),

)
