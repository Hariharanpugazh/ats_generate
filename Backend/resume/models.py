from djongo import models

class UserInfo(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    professional_summary = models.TextField(blank=True, null=True)
    fresher_or_professional = models.CharField(max_length=15)
    education = models.JSONField()  # For storing multiple educational entries
    skills = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.full_name
