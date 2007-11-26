from django.conf.urls.defaults import *

urlpatterns = patterns('',

    # Demo FrontPage
    (r'^$', "demo.views.front", {'template': 'front.html' }),

    # Profile
    (r'^profile/', include('profile.urls')),

    # Account
    (r'^accounts/', include('account.urls')),

    # Serves media content. WARNING!! Only for development uses
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': '../media/'}),


    # Admin (not really needed)
    (r'^admin/', include('django.contrib.admin.urls')),

)
