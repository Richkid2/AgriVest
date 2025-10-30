from django.contrib import admin
from .models import Investment

# Register Investment model in Django Admin
@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    # Fields to display in the admin panel
    list_display = ('investor', 'project', 'amount', 'status', 'created_at')
