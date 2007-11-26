from django.shortcuts import render_to_response
from profile.models import Profile

def front(request, template):
    """
    Frontpage of this sample application. It simply shows
    a template with the list of profiles in the DB.
    """
    profiles = Profile.objects.all()
    user = request.user

    return render_to_response(template, locals())

