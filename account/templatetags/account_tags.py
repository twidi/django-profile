from django.template import Library
from django.contrib.auth.models import User

register = Library()

@register.filter
def is_inactive(user):
    try:
        user = User.objects.get(username=user.data)
        return not user.is_active
    except:
        return False
