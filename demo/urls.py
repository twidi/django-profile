from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to, direct_to_template
from profile.models import Profile
from django.contrib.auth import views
from settings import APIKEY

urlpatterns = patterns('',
    (r'^$', "profile.views.profiles", {'template': 'front.html' }),

    # Private profile
    (r'^accounts/profile/$', 'profile.views.private', {'APIKEY': APIKEY, 'template': 'profile/private.html'}),
    (r'^accounts/profile/delete/$', 'profile.views.delete', {'template': 'profile/delete_confirm.html'}),
    (r'^accounts/profile/delete/done/$', direct_to_template, {'template': 'profile/delete_success.html'}),
    (r'^avatar/delete/$', 'profile.views.avatarDelete'),
    (r'^avatar/delete/(?P<avatar_id>[0-9]+)/$', 'profile.views.avatarDelete'),
    (r'^avatar/(?P<step>one|two)/$', 'profile.views.avatar', {'template': 'profile/avatar.html'}),
    (r'^getcountry_info/(?P<lat>[0-9\.\-]+)/(?P<lng>[0-9\.\-]+)/$', 'profile.views.fetch_geodata'),

    # Public profile
    (r'^users/(?P<user>[^/]*)/$', 'profile.views.public', {'template': 'profile/public.html'}),

    # Account
    (r'^accounts/activate/(?P<activation_key>\w+)/$', 'registration.views.activate'),
    (r'^accounts/password/reset/$', 'account.views.reset_password', {'template' : 'account/password_reset.html'}),
    (r'^accounts/password/reset/done/$', direct_to_template, {'template': 'account/password_reset_done.html'}),
    (r'^accounts/password/change/(?P<key>.{70})/$', 'account.views.change_password_with_key', {'template': 'account/password_change.html'}),
    (r'^accounts/password/change/$', 'account.views.change_password_authenticated', {'template': 'account/password_change.html'}),
    (r'^accounts/password/change/done/$', direct_to_template, {'template': 'account/password_change_done.html'}),
    (r'^accounts/email/change/$', 'account.views.email_change', {'template': 'account/email_change.html'}),
    (r'^accounts/email/change/processed/$', direct_to_template, {'template': 'account/email_change_processed.html'}),
    (r'^accounts/email/change/(?P<key>.{70})/$', 'account.views.change_email_with_key', {'template': 'account/email_change_done.html'}),
    (r'^accounts/login/$', views.login, {'template_name': 'account/login.html'}),
    (r'^accounts/logout/$', 'account.views.logout', {'template': 'account/logout.html'}),
    (r'^accounts/check_user/(?P<user>.*)/$', 'account.views.check_user'),
    (r'^accounts/check_email/(?P<email>.*)/$', 'account.views.check_email'),

    # Serves media content. WARNING!! Only for development uses
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'media/'}),

    # Registration
    url(r'^accounts/register/$', 'registration.views.register'),
    url(r'^accounts/register/complete/$', direct_to_template, {'template': 'registration/registration_complete.html'}),

    # Admin
    (r'^admin/', include('django.contrib.admin.urls')),

)
