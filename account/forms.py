from django import newforms as forms
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.utils.translation import ugettext as _
from account.models import Validation
from django.template import Context, loader
from django.conf import settings

class UserForm(forms.Form):

    username = forms.CharField(max_length=255, min_length = 3)
    email = forms.EmailField(required=False)
    password1 = forms.CharField(min_length=6, widget=forms.PasswordInput)
    password2 = forms.CharField(min_length=6, widget=forms.PasswordInput)

    def clean_username(self):
        """
        Verify that the username isn't already registered
        """
        username = self.cleaned_data.get("username")
        if not set(username).issubset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"):
            raise forms.ValidationError(_("That username has invalid characters. The valid values are letters, numbers and underscore."))

        if User.objects.filter(username__iexact=username).count() == 0:
            return username
        else:
            raise forms.ValidationError(_("The username is already registered."))

    def clean(self):
        """
        Verify that the 2 passwords fields are equal
        """
        if self.cleaned_data.get("password1") == self.cleaned_data.get("password2"):
            return self.cleaned_data
        else:
            raise forms.ValidationError(_("The passwords inserted are different."))

    def clean_email(self):
        """
        Verify that the email exists
        """
        email = self.cleaned_data.get("email")

        if not email: return  email

        try:
            User.objects.get(email=email)
            raise forms.ValidationError(_("That e-mail is already used."))
        except:
            return email

class EmailChangeForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        """
        Verify that the email exists
        """
        email = self.cleaned_data.get("email")
        try:
            User.objects.get(email=email)
        except:
            return email

        raise forms.ValidationError(_("That e-mail is already used."))

class ValidationForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        """
        Verify that the email or the user exists
        """
        email = self.cleaned_data.get("email")
        try:
            User.objects.get(email=email)
        except:
            raise forms.ValidationError(_("There's no user with that e-mail"))

        return email

class changePasswordKeyForm(forms.Form):
    newpass1 = forms.CharField(min_length=6, widget=forms.PasswordInput)
    newpass2 = forms.CharField(min_length=6, widget=forms.PasswordInput)

    def clean(self):
        """
        Verify the equality of the two passwords
        """

        if self.cleaned_data.get("newpass1") and self.cleaned_data.get("newpass1") == self.cleaned_data.get("newpass2"):
            return self.cleaned_data
        else:
            raise forms.ValidationError(_("The passwords inserted are different."))

    def save(self, key):
        "Saves the new password."
        lostpassword = Validation.objects.get(key=key)
        user = lostpassword.user
        user.set_password(self.cleaned_data.get('newpass1'))
        user.save()
        lostpassword.delete()

class changePasswordAuthForm(forms.Form):
    newpass1 = forms.CharField( min_length = 6, widget = forms.PasswordInput )
    newpass2 = forms.CharField( min_length = 6, widget = forms.PasswordInput )

    def clean(self):
        """
        Verify the equality of the two passwords
        """

        if self.cleaned_data.get("newpass1") and self.cleaned_data.get("newpass1") == self.cleaned_data.get("newpass2"):
            return self.cleaned_data
        else:
            raise forms.ValidationError(_("The passwords inserted are different."))

    def save(self, user):
        "Saves the new password."
        user.set_password(self.cleaned_data.get('newpass1'))
        user.save()
