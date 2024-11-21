from django.urls import path
from . import views  # Import your views here

urlpatterns = [
    path('save-user-info/', views.save_user_info, name='save_user_info'),
    path('fetch-latest-user-info/', views.fetch_latest_user_info, name='fetch_latest_user_info'),
    path('example-path/', views.my_view, name='example-view'),
    path('api/register/', views.register_user, name='register_user'),
    path('api/login/', views.login_user, name='login_user'),
]

