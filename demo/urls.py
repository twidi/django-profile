from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to, direct_to_template
from profile.models import Profile

urlpatterns = patterns('',

    # Profile
    (r'^profile/', include('profile.urls')),

    # Account
    (r'^accounts/', include('account.urls')),

    # Demo FrontPage
    (r'^$', "profile.views.profiles", {'template': 'front.html' }),

    # Serves media content. WARNING!! Only for development uses
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'media/'}),


    # Admin
    (r'^admin/', include('django.contrib.admin.urls')),

)
