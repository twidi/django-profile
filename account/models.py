from django.db import models
from django.contrib.auth.models import User
import datetime

class LostPassword(models.Model):
    user = models.ForeignKey(User)
    key = models.CharField(max_length=70, unique=True)
    created = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return (datetime.datetime.today() - self.created).days > 0

    class Admin:
        pass

class EmailValidate(models.Model):
    user = models.ForeignKey(User)
    email = models.EmailField()
    key = models.CharField(max_length=70, unique=True)
    created = models.DateTimeField(auto_now_add=True)

    class Admin:
        pass
