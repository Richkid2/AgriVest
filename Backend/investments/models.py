from django.db import models
from django.conf import settings
from projects.models import Project  


#Django’s built-in user model
User = settings.AUTH_USER_MODEL


# Investment model  when a user invests in a project
class Investment(models.Model):
    # The person who made the investment (a registered user)
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="investments")
    
    # The project that the user invested in
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="investments")
    
    # The amount of money the user invested
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # When the investment was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Current state of the investment — e.g. pending approval, approved, or completed
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('completed', 'Completed'),
        ],
        default='pending'
    )

    # How the object will appear in the admin or shell
    def __str__(self):
        return f"{self.investor.username} invested ₦{self.amount} in {self.project.title}"
