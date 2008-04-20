from django.shortcuts import render_to_response
from django.contrib.auth.models import User
from django.template import RequestContext

def front(request, template):
    """
    Frontpage of this sample application. It simply shows
    a template with the list of profiles in the DB.
    """
    users = User.objects.filter(is_active=True).order_by("-date_joined")

    return render_to_response(template, locals(), context_instance=RequestContext(request))
