from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Fields to display in the admin user list
    list_display = ('username', 'email', 'role', 'is_verified', 'is_active', 'is_staff')
    
    # Add filters
    list_filter = ('role', 'is_verified', 'is_staff')
    
    # Fields that can be edited when viewing a user
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'phone', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')}),
    )

    # Fields to show when creating a user in the admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'role', 'password1', 'password2', 'is_verified'),
        }),
    )

    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)