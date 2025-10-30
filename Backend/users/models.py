from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('investor', 'Investor'),
        ('farmer', 'Farmer'),
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, blank=True, null=True)
    is_verified = models.BooleanField(default=True)
    
    
    def __str__(self):
        return self.username