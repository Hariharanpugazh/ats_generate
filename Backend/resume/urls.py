from django.urls import path
from .views import save_user_info

urlpatterns = [
    path('save-user-info/', save_user_info, name='save_user_info'),
]
