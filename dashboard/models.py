from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class FinancialLineItem(models.Model):
    entity_name = models.CharField(max_length=255)
    account_code = models.CharField(max_length=20)
    description = models.CharField(max_length=255) 

    ytd_actual = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    annual_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    category = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Optional group like 'Revenue', 'IT', 'Audit'"
    )
    item_type = models.CharField(
        max_length=50,
        choices=[
            ("statement", "Income Statement"),
            ("budget", "Budget Line Item"),
        ],
        default="statement",
        help_text="Label this row as 'statement' or 'budget'"
    )

    @property
    def percent_used(self):
        if self.annual_budget:
            return (self.ytd_actual / self.annual_budget) * 100
        return None

    def __str__(self):
        return f"{self.account_code} | {self.description} | {self.entity_name}"


    def __str__(self):
        return f"{self.date} - {self.category} - {self.amount}"
    
class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    page = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"User {self.user.username} performed {self.action} at {self.timestamp}"


def get_default_user():
    user, created = User.objects.get_or_create(username="default_user", email="default@example.com")
    return user.id 
