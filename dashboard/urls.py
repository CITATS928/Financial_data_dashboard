from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import api_views
from . import views
from .api_views import UploadCSVView, FinancialDataView
from .views import get_csrf_token
# from .views import total_actual_by_entity
from .views import aggregate_report



urlpatterns = [
    path('dashboard/upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('dashboard/table/', FinancialDataView.as_view(), name='financial-data'),
    path('', views.index, name='index'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('signup/', views.SignupPage, name='signup'),
    path('api/csrf/', get_csrf_token),
    path('api/aggregate_report/', aggregate_report),
    path('api/entity-yearly-actual/<str:entity_name>/', views.entity_yearly_actual),
    path('api/entities/', views.get_entity_names, name='get_entity_names'),
    path('api/', include('dashboard.api_urls')),

]

