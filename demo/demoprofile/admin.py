from django.contrib import admin
from demoprofile.models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'date')
    search_fields = ('name',)

admin.site.register(Profile, ProfileAdmin)
