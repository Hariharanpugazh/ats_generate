from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import UserInfo
import json
from django.views.decorators.http import require_http_methods
import logging


@csrf_exempt
def save_user_info(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # Assuming you have new fields like certifications and achievements
        certifications = data.get('certifications', [])
        achievements = data.get('achievements', [])
        languages = data.get('languages', [])

        # Existing code to create or update the rest of the user info
        user_info, created = UserInfo.objects.update_or_create(
            email=data['personalInfo']['email'],
            defaults={
                'full_name': data['personalInfo']['name'],
                'phone': data['personalInfo']['phone'],
                'address': data['personalInfo']['address'],
                'professional_summary': data['professionalSummary'],
                'fresher_or_professional': data['fresherOrProfessional'],
                'education': data['education'],
                'skills': ",".join([skill['label'] for skill in data.get('skills', [])]),
                'projects': data['projects'],
                'experience': data['experience'],
                'certifications': certifications,
                'achievements': achievements,
                'languages': languages
            }
        )
        return JsonResponse({'message': 'User info saved successfully'}, status=200)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def my_view(request):
    try:
        # Implement your logic here
        # This is just a placeholder logic
        result = {"status": "success", "message": "This is a successful response."}
        return JsonResponse(result)
    except Exception as e:
        # This will catch any exception in the try block
        return JsonResponse({'error': str(e)}, status=500)

  
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
            logger.error("No user data found")
            return JsonResponse({"error": "No user data found"}, status=404)

        # Prepare data ensuring that list fields are properly formatted
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
            "certifications": latest_user.certifications if isinstance(latest_user.certifications, list) else [],
            "achievements": latest_user.achievements if isinstance(latest_user.achievements, list) else [],
            "languages": latest_user.languages if isinstance(latest_user.languages, list) else []
        }

        # Conditionally add projects and experience based on the user type
        if latest_user.fresher_or_professional == 'fresher':
            user_data['projects'] = latest_user.projects if isinstance(latest_user.projects, list) else []
        else:
            user_data['experience'] = latest_user.experience if isinstance(latest_user.experience, list) else []

        logger.debug("User Data being returned: %s", user_data)
        return JsonResponse(user_data, status=200)
    except Exception as e:
        logger.exception("Failed to fetch user info: %s", str(e))
        return JsonResponse({"error": str(e)}, status=500)   

