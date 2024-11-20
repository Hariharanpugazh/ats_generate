from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import UserInfo
import json

@csrf_exempt
def save_user_info(request):
    if request.method == "POST":
        try:
            # Parse incoming JSON data
            data = json.loads(request.body.decode('utf-8'))

            # Process skills field to extract strings if it's a list of dictionaries
            skills = data.get('skills', [])
            if skills and isinstance(skills[0], dict):
                skills = [skill.get('label', '') for skill in skills if 'label' in skill]

            # Save user data to MongoDB
            user_info = UserInfo.objects.create(
                full_name=data.get('personalInfo', {}).get('name'),
                email=data.get('personalInfo', {}).get('email'),
                phone=data.get('personalInfo', {}).get('phone'),
                address=data.get('personalInfo', {}).get('address'),
                professional_summary=data.get('professionalSummary'),
                fresher_or_professional=data.get('fresherOrProfessional'),
                education=data.get('education'),
                skills=",".join(skills),  # Convert list of strings to comma-separated string
            )
            return JsonResponse({'message': 'User info saved successfully!'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
