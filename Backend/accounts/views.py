from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User

def authenticate_plain_text(email=None, password=None):
    """
    Authenticates a user with plain text passwords.
    
    Args:
        email (str): The email of the user.
        password (str): The plain text password to validate.

    Returns:
        User object if authentication is successful, None otherwise.
    """
    try:
        user = User.objects.get(email=email)
        if user.password == password:  # Compare plain text passwords
            return user
    except User.DoesNotExist:
        return None

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)
        
        user = User.objects.create_user(email=email, name=name, password=password)
        return JsonResponse({'message': 'Signup successful!'}, status=201)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate_plain_text(email=email, password=password)
        if user:
            return JsonResponse({'message': 'Login successful!'}, status=200)
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
