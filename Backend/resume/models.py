from django.db import models
from django.utils.timezone import now

class UserInfo(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)  # Enforce uniqueness here
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    professional_summary = models.TextField(blank=True, null=True)
    fresher_or_professional = models.CharField(max_length=20)
    education = models.JSONField()
    projects = models.JSONField(blank=True, null=True)
    experience = models.JSONField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    last_modified = models.DateTimeField(auto_now=True)  # Auto-updates on save

    def __str__(self):
        return self.full_name


