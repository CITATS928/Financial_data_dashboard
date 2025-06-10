from django.urls import path
from . import views
from .api_views import (
    signup_api_view,
    LogoutAPIView,
    UploadCSVView,
    FinancialDataView,
    SessionLoginView,
    UploadFinancialLineItemsView,       
    FinancialLineItemsListView,
    MyUploadedItemsView,
    MyUploadedFilesView,
)
from .api_views import CurrentUserView, UpdateProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('table/', FinancialDataView.as_view(), name='financial-data'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/signup/', signup_api_view, name='signup'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/session-login/', SessionLoginView.as_view(), name='session_login'),
    path('logout/', LogoutAPIView, name='api_logout'),
    path("financial-line-items/", FinancialLineItemsListView.as_view(), name="financial-line-items"),
    path('upload-financial-line-items/', UploadFinancialLineItemsView.as_view(), name='upload-financial-line-items'),
    path("current-user/", CurrentUserView.as_view(), name="current_user"),
    path("update-profile/", UpdateProfileView.as_view(), name="update_profile"),
    # path("my-files/", MyUploadedItemsView.as_view(), name="my_uploaded_items"),
    path("my-uploaded-files/", MyUploadedFilesView.as_view(), name="my_uploaded_files"),

    path('aggregate-report/', views.aggregate_report, name='aggregate-report'),
     path('entities/', views.get_entity_names, name='get_entity_names'),
    path('entity-yearly-actual/<str:entity_name>/', views.entity_yearly_actual, name='entity_yearly_actual'),
    path('entity-quarterly-actual/<str:entity_name>/', views.entity_quarterly_actual, name='entity_quarterly_actual'),
]
