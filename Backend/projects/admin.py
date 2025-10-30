from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'farm_type', 'funding_goal', 'amount_raised', 'is_open')
    list_filter = ('farm_type', 'is_open')
    search_fields = ('farmer__username', 'description')
    ordering = ('-start_date',)
    fieldsets = (
        (None, {'fields': ('farmer', 'description', 'farm_type')}),
        ('Funding Info', {'fields': ('funding_goal', 'amount_raised')}),
        ('Project Duration', {'fields': ('start_date', 'end_date')}),
        ('Status', {'fields': ('is_open',)}),
    )
    
