from django.db import models
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template import loader, Context
from django.contrib.sites.models import Site
import datetime

class ValidateManager(models.Manager):

    def verify(self, key, user, type):
        try:
            verify = self.get(key=key, user=user, type=type)
            if verify.is_valid():
                user = User.objects.get(username=user)
                user.email = verify.email
                user.save()
                verify.delete()
                return True
            else:
                verify.delete()
                return False
        except:
            return False

    def add(self, user, type, email=""):
        """
        Add a new validation process entry
        """
        while True:
            key = User.objects.make_random_password(70)
            try:
                Validate.objects.get(key=key)
            except Validate.DoesNotExist:
                self.key = key
                break

        site = Site.objects.get_current()
        if type == "email":
            template = "account/email_change_email.txt"
            title = 'Email change confirmation on %s' % site.name

        t = loader.get_template(template)
        message = 'http://%s/accounts/email/change/%s/' % (site.name, key)
        site_name = site.name
        send_mail(title, t.render(Context(locals())), None, [email])
        user = User.objects.get(username=str(user))
        self.filter(user=user, type=type).delete()
        return self.create(user=user, key=key, type=type, email=email)

class Validate(models.Model):
    type = models.PositiveSmallIntegerField(choices=( (1, 'email'), (2, 'passwd'), (3, 'user')))
    user = models.ForeignKey(User)
    email = models.EmailField(blank=True)
    key = models.CharField(max_length=70, unique=True, db_index=True)
    created = models.DateTimeField(auto_now_add=True)
    objects = ValidateManager()

    class Admin:
        list_display = ('__unicode__',)
        search_fields = ('user__username', 'user__first_name')

    def __unicode__(self):
        return _("Email validation process for %s") % self.user

    def is_expired(self):
        return (datetime.datetime.today() - self.created).days > 0

    def save(self):
        super(Validate, self).save()
