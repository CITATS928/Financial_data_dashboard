from django.urls import path
from .api_views import UploadCSVView, FinancialDataView
from .api_views import SessionLoginView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('table/', FinancialDataView.as_view(), name='financial-data'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('session-login/', SessionLoginView.as_view(), name='session_login'),

]
