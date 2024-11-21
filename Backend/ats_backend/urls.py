from django.contrib import admin
from django.urls import path, include  # Import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('resume/', include('resume.urls')),  # Include the app's URLs (replace `resume` with your app name)
]

