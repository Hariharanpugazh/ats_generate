from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import UserInfo
import json

import logging

@csrf_exempt
def save_user_info(request):
    if request.method == "POST":
        try:
            # Parse incoming data
            data = json.loads(request.body.decode('utf-8'))

            # Process skills
            skills = data.get('skills', [])
            if skills and isinstance(skills[0], dict):
                skills = [skill.get('label', '') for skill in skills if 'label' in skill]

            # Handle empty fields
            education = data.get('education', [])
            projects = data.get('projects', [])
            experience = [exp for exp in data.get('experience', []) if any(exp.values())]

            # Update or create record based on email
            user_info, created = UserInfo.objects.update_or_create(
                email=data.get('personalInfo', {}).get('email'),
                defaults={
                    "full_name": data.get('personalInfo', {}).get('name', ''),
                    "phone": data.get('personalInfo', {}).get('phone', ''),
                    "address": data.get('personalInfo', {}).get('address', ''),
                    "professional_summary": data.get('professionalSummary', ''),
                    "fresher_or_professional": data.get('fresherOrProfessional', ''),
                    "education": education,
                    "skills": ",".join(skills),
                    "projects": projects,
                    "experience": experience,
                },
            )

            return JsonResponse({"message": "User info saved successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

  
def sanitize_field(field, default):
    if isinstance(field, list):
        return field
    try:
        # Attempt to parse JSON field if stored incorrectly
        return json.loads(field) if isinstance(field, str) else default
    except Exception:
        return default




logger = logging.getLogger(__name__)

def fetch_latest_user_info(request):
    try:
        # Fetch the most recently updated user info
        latest_user = UserInfo.objects.order_by('-last_modified').first()

        if not latest_user:
            return JsonResponse({"error": "No user data found"}, status=404)

        user_data = {
            "personalInfo": {
                "name": latest_user.full_name,
                "email": latest_user.email,
                "phone": latest_user.phone,
                "address": latest_user.address,
            },
            "professionalSummary": latest_user.professional_summary,
            "fresherOrProfessional": latest_user.fresher_or_professional,
            "education": latest_user.education if isinstance(latest_user.education, list) else [],
            "skills": latest_user.skills.split(",") if latest_user.skills else [],
        }

        # Add projects if the user is a fresher
        if latest_user.fresher_or_professional == 'fresher':
            user_data['projects'] = latest_user.projects if isinstance(latest_user.projects, list) else []
        # Add work experience if the user is a professional
        else:
            user_data['experience'] = latest_user.experience if isinstance(latest_user.experience, list) else []

        return JsonResponse(user_data, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)