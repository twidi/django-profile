from django.shortcuts import render_to_response, get_object_or_404
from django import newforms as forms
from django.http import Http404
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext as _
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from models import Validation
from django.utils import simplejson
from django.template import RequestContext
from forms import UserForm, EmailChangeForm, ValidationForm, changePasswordKeyForm, changePasswordAuthForm
from django.contrib.auth.decorators import login_required
from django.template import Context, loader
from django.conf import settings
from django.core.validators import email_re

def json_error_response(error_message, *args, **kwargs):
    return HttpResponse(simplejson.dumps(dict(success=False,
                                              error_message=error_message), ensure_ascii=False))

@login_required
def change_email_with_key(request, key, template):
    """
    Verify key and change email
    """
    if Validation.objects.verify(key=key):
        message = _('E-mail changed successfully.')
        successful = True
    else:
        message = _('The key you received via e-mail is no longer valid. Please try the e-mail change process again.')
        successful = False

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def email_validation_with_key(request, key, template):
    """
    Validate the e-mail of an account and activate it
    """
    if Validation.objects.verify(key=key):
        message = _('Account validated successfully.')
        successful = True
    else:
        message = _('The key you received via e-mail is no longer valid. Please try the e-mail validation process again.')
        successful = False

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def email_change(request, template):
    """
    Change the e-mail page
    """
    if request.method == 'POST':
        form = EmailChangeForm(request.POST)
        if form.is_valid():
            Validation.objects.add(user=request.user, email=form.cleaned_data.get('email'), type="email")
            return HttpResponseRedirect('%sprocessed/' % request.path)
    else:
        form = EmailChangeForm()

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def register(request, template):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            newuser = User.objects.create_user(username=username, email='', password=password)

            if hasattr(settings, "EMAIL_VALIDATION") and settings.EMAIL_VALIDATION == True:
                newuser.is_active = False
                newuser.email = form.cleaned_data.get('email')
                newuser.save()
                Validation.objects.add(user=newuser, email=newuser.email, type="user")
                return HttpResponseRedirect('%svalidate/' % request.path)
            else:
                newuser.save()
                return HttpResponseRedirect('%scomplete/' % request.path)
    else:
        form = UserForm()

    if hasattr(settings, "EMAIL_VALIDATION") and settings.EMAIL_VALIDATION == True:
        email = True

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def reset_password(request, template):
    if request.method == 'POST':
        form = ValidationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            user = User.objects.get(email=email)

            if email and user:
                Validation.objects.add(user=user, email=email, type="passwd")
                return HttpResponseRedirect('%sdone/' % request.path)

    else:
        form = ValidationForm()

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def resend_validation(request, template):
    if request.method == 'POST':
        form = ValidationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            user = User.objects.get(email=email)
            if email and user and not user.is_active:
                Validation.objects.add(user=user, email=email, type="user")
                action = "success"
            else:
                action = "failed"

            return HttpResponseRedirect('%s%s/' % (request.path, action))

    else:
        form = ValidationForm()

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def change_password_with_key(request, key, template):
    """
    Change a user password with the key sended by e-mail
    """

    if not Validation.objects.verify(key=key):
        return render_to_response('account/password_expired.html', context_instance=RequestContext(request))

    user = Validation.objects.getuser(key=key)
    if request.method == "POST":
        form = changePasswordKeyForm(request.POST)
        if form.is_valid():
            form.save(key)
            return HttpResponseRedirect('/accounts/password/change/done/')
    else:
        form = changePasswordKeyForm()

    return render_to_response(template, locals(), context_instance=RequestContext(request))

@login_required
def change_password_authenticated(request, template):
    """
    Change the password of the authenticated user
    """
    if request.method == "POST":
        form = changePasswordAuthForm(request.POST)
        if form.is_valid():
            form.save(request.user)
            return HttpResponseRedirect('/accounts/password/change/done/')
    else:
        form = changePasswordAuthForm()

    return render_to_response(template, locals(), context_instance=RequestContext(request))

def check_user(request, user):
    """
    Check if a username exists. Only HTTPXMLRequest. Returns JSON
    """
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if len(user) < 3 or not set(user).issubset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_") or User.objects.filter(username__iexact=user).count() > 0:
            return json_error_response(simplejson.dumps({'success': False}))
        else:
            return HttpResponse(simplejson.dumps({'success': True}))
    else:
        raise Http404

def check_email_unused(request, email):
    """
    Check if an e-mail exists. Only HTTPXMLRequest. Returns JSON
    """
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if not email_re.search(email):
            return json_error_response(_("Invalid e-mail"))

        if not User.objects.filter(email=email):
            return HttpResponse(simplejson.dumps({'success': True}))
        else:
            return json_error_response(_("E-mail not registered"))
    else:
        raise Http404

def check_email(request, email):
    """
    Check if a username exists. Only HTTPXMLRequest. Returns JSON
    """
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if (len(User.objects.filter(email=email)) == 1):
            return HttpResponse(simplejson.dumps({'success': True}))
        else:
            return json_error_response(_("E-mail not registered"))
    else:
        raise Http404

def logout(request, template):
    from django.contrib.auth import logout
    logout(request)
    return render_to_response(template, locals(), context_instance=RequestContext(request))
