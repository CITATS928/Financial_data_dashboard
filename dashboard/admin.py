from django.contrib import admin

# Register your models here.
from .models import UploadedFile, FinancialLineItem
admin.site.register(UploadedFile)
admin.site.register(FinancialLineItem)
