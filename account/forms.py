from django import newforms as forms
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.utils.translation import ugettext as _
from models import LostPassword, EmailValidate
from django.template import Context, loader

def new_key():
    while True:
        key = User.objects.make_random_password(70)
        try:
            LostPassword.objects.get(key=key)
        except LostPassword.DoesNotExist:
            return key

class EmailChangeForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        """
        Verify that the email exists
        """
        email = self.cleaned_data.get("email")

        return email

class PasswordResetForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        """
        Verify that the email and the user exists
        """
        email = self.cleaned_data.get("email")
        try:
            User.objects.get(email=email)
        except:
            raise forms.ValidationError(_("There's no user with that e-mail"))

        return email

class changePasswordKeyForm(forms.Form):
    newpass1 = forms.CharField( min_length = 6, widget = forms.PasswordInput )
    newpass2 = forms.CharField( min_length = 6, widget = forms.PasswordInput )

    def clean_newpass2(self):
        """
        Verify the equality of the two passwords
        """

        if self.cleaned_data.get("newpass1") and self.cleaned_data.get("newpass1") == self.cleaned_data.get("newpass2"):
            return self.cleaned_data.get("newpass2")
        else:
            raise forms.ValidationError(_("The passwords inserted are different."))

    def save(self, key):
        "Saves the new password."
        lostpassword = LostPassword.objects.get(key=key)
        user = lostpassword.user
        user.set_password(self.cleaned_data.get('newpass1'))
        user.save()
        lostpassword.delete()

class changePasswordAuthForm(forms.Form):
    newpass1 = forms.CharField( min_length = 6, widget = forms.PasswordInput )
    newpass2 = forms.CharField( min_length = 6, widget = forms.PasswordInput )

    def clean_newpass2(self):
        """
        Verify the equality of the two passwords
        """

        if self.cleaned_data.get("newpass1") and self.cleaned_data.get("newpass1") == self.cleaned_data.get("newpass2"):
            return self.cleaned_data.get("newpass2")
        else:
            raise forms.ValidationError(_("The passwords inserted are different."))

    def save(self, user):
        "Saves the new password."
        user.set_password(self.cleaned_data.get('newpass1'))
        user.save()
