from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Project(models.Model):
    FARM_TYPE_CHOICES = [
        ('crop', 'Crop Farming'),
        ('livestock', 'Livestock'),
        ('fishery', 'Fishery'),
        ('poultry', 'Poultry'),
    ]

    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    description = models.TextField()
    farm_type = models.CharField(max_length=20, choices=FARM_TYPE_CHOICES)
    funding_goal = models.DecimalField(max_digits=12, decimal_places=2)
    amount_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    is_open = models.BooleanField(default=True)

    def clean(self):
        """Ensure end_date is not before start_date."""
        if self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")

    def __str__(self):
        return f"{self.farmer.username}'s {self.farm_type} project"

