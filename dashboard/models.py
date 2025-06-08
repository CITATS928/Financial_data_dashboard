from django.db import models
from django.contrib.auth.models import User
from datetime import date
# Create your models here.
class FinancialLineItem(models.Model):
    entity_name = models.CharField(max_length=255)
    account_code = models.CharField(max_length=20)
    description = models.CharField(max_length=255) 

    ytd_actual = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    annual_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    date = models.DateField() 
    

    category = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Optional group like , 'IT', 'Audit'"
    )
    item_type = models.CharField(
    max_length=20,
    choices=[
        ("revenue", "Revenue"),
        ("expense", "Expense"),
        ("cogs", "Cost of Goods Sold"),
        ("other_income", "Other Income"),
        ("tax", "Tax"),
    ],
    help_text="Classify this line as revenue, expense, COGS, etc."
)
    expense_nature = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        choices=[
            ("cash_operating", "Cash Operating"),
            ("depreciation", "Depreciation"),
            ("amortization", "Amortization"),
        ],
        help_text="Further classification of expenses (non-cash vs. cash)"
    )
    @property
    def percent_used(self):
        if self.annual_budget:
            return (self.ytd_actual / self.annual_budget) * 100
        return None

    @property
    def gross_profit(self):
        return self.ytd_actual - 1000  # Placeholder logic

    @property
    def ebitda(self):
        return self.gross_profit - 500  # Placeholder logic

    @property
    def ebit(self):
        return self.ebitda - 300  # Placeholder logic

    @property
    def profit_before_tax(self):
        return self.ebit - 200  # Placeholder logic

    @property
    def profit_for_period(self):
        return self.profit_before_tax - 100  # Placeholder logic

    def __str__(self):
        return f"{self.account_code} | {self.description} | {self.entity_name}"


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