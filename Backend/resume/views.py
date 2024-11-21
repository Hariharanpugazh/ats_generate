from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import UserInfo
import json
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password, check_password
import logging
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.ATSResumeDB  # Your MongoDB Database Name
userinfo_collection = db.userinfo  # Collection name

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')  # Save password as plain text

        # Check if email already exists
        if userinfo_collection.find_one({'email': email}):
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # Insert user into collection
        userinfo_collection.insert_one({
            'username': username,
            'email': email,
            'password': password,
        })

        return JsonResponse({'message': 'Registration successful'}, status=201)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        # Check user credentials
        user = userinfo_collection.find_one({'email': email, 'password': password})
        if user:
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid email or password'}, status=401)

@csrf_exempt
def save_user_info(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract fields from the request
            personal_info = data.get('personalInfo', {})
            email = personal_info.get('email')
            full_name = personal_info.get('name', '')
            phone = personal_info.get('phone', '')
            address = personal_info.get('address', '')
            certifications = data.get('certifications', [])
            achievements = data.get('achievements', [])
            languages = data.get('languages', [])
            education = data.get('education', [])
            projects = data.get('projects', [])
            experience = data.get('experience', [])
            skills = data.get('skills', [])

            # Create a new UserInfo record
            user_info = UserInfo.objects.create(
                email=email,
                full_name=full_name,
                phone=phone,
                address=address,
                professional_summary=data.get('professionalSummary', ''),
                fresher_or_professional=data.get('fresherOrProfessional', ''),
                education=education,
                skills=",".join([skill.get('label', '') for skill in skills]),
                projects=projects,
                experience=experience,
                certifications=certifications,
                achievements=achievements,
                languages=languages
            )

            return JsonResponse({'message': 'User info saved successfully'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
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

