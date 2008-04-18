from django.db import models
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template import loader
from django.contrib.sites.models import Site
import datetime

class Validate(models.Model):
    type = models.PositiveSmallIntegerField(choices=( (1, 'email'), (2, 'passwd'), (3, 'user')))
    user = models.ForeignKey(User)
    email = models.EmailField(blank=True)
    key = models.CharField(max_length=70, unique=True, db_index=True)
    created = models.DateTimeField(auto_now_add=True)

    class Admin:
        list_display = ('__unicode__',)
        search_fields = ('user__username', 'user__first_name')

    def __unicode__(self):
        return _("Email validation process for %s") % self.user

    def is_expired(self):
        return (datetime.datetime.today() - self.created).days > 0

    def save(self):
        while True:
            key = User.objects.make_random_password(70)
            try:
                Validate.objects.get(key=key)
            except Validate.DoesNotExist:
                self.key = key

        site = Site.objects.get_current()
        t = loader.get_template('account/email_change_confirmation.txt')
        message = 'http://%s/accounts/email/change/%s/' % (site.name, validate.key)
        #send_mail('Email change confirmation on %s' % site.name, t.render(Context(locals())), None, [email])
        super(Validate, self).save()
