from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from django.template import loader, Context
from django.contrib.sites.models import Site
import datetime

class ValidationManager(models.Manager):

    def verify(self, key):
        try:
            verify = self.get(key=key)
            if not verify.is_expired():
                if verify.get_type_display() == "email":
                    verify.user.email = verify.email
                    verify.user.save()
                    verify.delete()
                elif verify.get_type_display() == "user":
                    verify.user.is_active = True
                    verify.user.save()
                    verify.delete()
                return True
            else:
                verify.delete()
                return False
        except:
            return False

    def getuser(self, key):
        try:
            return self.get(key=key).user
        except:
            return False

    def add(self, user, type, email):
        """
        Add a new validation process entry
        """
        while True:
            key = User.objects.make_random_password(70)
            try:
                Validation.objects.get(key=key)
            except Validation.DoesNotExist:
                self.key = key
                break

        site = Site.objects.get_current()
        template = "account/%s_email.html" % type
        if type == "email":
            message = 'http://%s/account/email/change/%s/' % (site.domain, key)
            title = _("Email change confirmation on %s") % site.name
        elif type == "passwd":
            message = 'http://%s/account/password/change/%s/' % (site.domain, key)
            title = _("Password reset on %s") % site.name
        elif type == "user":
            message = 'http://%s/account/validate/%s/' % (site.domain, key)
            title = _("Activate your account on %s") % site.name

        t = loader.get_template(template)
        site_name = site.name
        send_mail(title, t.render(Context(locals())), None, [email])
        user = User.objects.get(username=str(user))
        type_choices = { "email": 1, "passwd": 2, "user": 3}
        self.filter(user=user, type=type_choices[type]).delete()
        return self.create(user=user, key=key, type=type_choices[type], email=email)

class Validation(models.Model):
    type = models.PositiveSmallIntegerField(choices=( (1, 'email'), (2, 'passwd'), (3, 'user')))
    user = models.ForeignKey(User)
    email = models.EmailField(blank=True)
    key = models.CharField(max_length=70, unique=True, db_index=True)
    created = models.DateTimeField(auto_now_add=True)
    objects = ValidationManager()

    class Admin:
        list_display = ('__unicode__',)
        search_fields = ('user__username', 'user__first_name')

    def __unicode__(self):
        return _("Email validation process for %(user)s of type %(type)s") % { 'user': self.user, 'type': self.get_type_display() }

    def is_expired(self):
        return (datetime.datetime.today() - self.created).days > 0

    def save(self):
        super(Validation, self).save()
