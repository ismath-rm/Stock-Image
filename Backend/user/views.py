from django.shortcuts import render
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import Account
# from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .serializers import ResetPasswordSerializer

# Create your views here.
class MyRefreshTokenObtainPairSerializer(TokenRefreshSerializer):
	def __init__(self, *args, **kwargs):
		request = kwargs.pop('request', None)
		super().__init__(*args, **kwargs)
          

class MyRefreshTokenObtainPairView(TokenRefreshView):
	serializer_class = MyRefreshTokenObtainPairSerializer
	

# class Signup(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         print('Signup endpoint hit')
#         print('Request data:', request.data)
#         try:
#             # Extracting user data from the request
#             username = request.data.get('username')
#             email = request.data.get('email')
#             password = request.data.get('password')
#             phone = request.data.get('phoneNumber')

#             print(f"Received username: {username}, email: {email}, phone number: {phone}, password: {'*' * len(password) if password else None}")

#             # Validation
#             if not email or not password:
#                 print("Validation failed: Email and password are required")
#                 return Response({'error': "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

#             # Check if the user already exists
#             if Account.objects.filter(username=username).exists():
#                 print(f"User with username '{username}' already exists")
#                 return Response({'error': "User with this username already exists"}, status=status.HTTP_400_BAD_REQUEST)

#             if Account.objects.filter(email=email).exists():
#                 print(f"User with email '{email}' already exists")
#                 return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
 
#             if phone and Account.objects.filter(phone=phone).exists():
#                 print(f"User with phone number '{phone}' already exists")
#                 return Response({'error': 'User with this phone number already exists'}, status=status.HTTP_400_BAD_REQUEST)

#             # Create new user
#             print('Creating new user...')
#             user = Account.objects.create(
#                 username=username,
#                 email=email,
#                 password=make_password(password),  # Hash the password before saving it
#                 phone=phone  # Include phone number if provided
#             )
#             print(f"User '{username}' created successfully")

#             # Return a success response
#             return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             print(f'An error occurred: {e}')
#             return Response({'error': 'An error occurred while creating the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class Signup(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print('Signup endpoint hit')
        print('Request data:', request.data)
        try:
            # Extracting user data from the request
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            phone = request.data.get('phoneNumber')  # Ensure this matches the key in your request

            print(f"Received username: {username}, email: {email}, phone number: {phone}, password: {'*' * len(password) if password else None}")

            # Validation
            if not email or not password:
                print("Validation failed: Email and password are required")
                return Response({'error': "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the user already exists
            if Account.objects.filter(username=username).exists():
                print(f"User with username '{username}' already exists")
                return Response({'error': "User with this username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            if Account.objects.filter(email=email).exists():
                print(f"User with email '{email}' already exists")
                return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            if phone and Account.objects.filter(phone=phone).exists():
                print(f"User with phone number '{phone}' already exists")
                return Response({'error': 'User with this phone number already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Create new user
            print('Creating new user...')
            user = Account.objects.create(
                username=username,
                email=email,
                password=make_password(password),  # Hash the password before saving it
                phone=phone  # Include phone number if provided
            )
            print(f"User '{username}' created successfully")

            # Return a success response
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f'An error occurred: {e}')
            return Response({'error': 'An error occurred while creating the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Login(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            # Extract data from the request
            username = request.data.get('username')
            password = request.data.get('password')

            print(f"Attempting login for Username: {username}, Password: {'*' * len(password) if password else None}")

            # Basic validation
            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the user exists in the database
            user_exists = Account.objects.filter(username=username).exists()
            print(f"User exists: {user_exists}") 

            if user_exists:
                user = Account.objects.get(username=username)
                print(f"User is_active: {user.is_active}")
                print(f"Password matches: {user.check_password(password)}")  # Should be True if the password matches

                # Make user active if they are not
                if not user.is_active:
                    user.is_active = True
                    user.save()
                    print("User is now active")

            # Check if the user exists
            user = authenticate(username=username, password=password)
            print(f'Authenticated user: {user}')
            if user is None:
                return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)
            
            refresh = RefreshToken.for_user(user)
            print(refresh)

            # Successful authentication
            return Response({
                "username":user.username,
                "email":user.email,
                "id":user.id,
                "is_authenticated":user.is_active,
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "is_superuser": user.is_superuser  # Add this line
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            print(f"An error occurred: {e}")

            # Return a generic error response
            return Response({"error": "An error occurred while logging in"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Account.objects.get(email=email)
        except Account.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Generate token and URL for password reset
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/auth/resetpassword/{uid}/{token}/"


        # Construct email message
        subject = "Reset your password"
        message = f"Hello {user.username},\n\nPlease click the following link to reset your password:\n{reset_url}"

        # Send the reset password email
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

        return Response({"detail": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)




class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Account.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Account.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            serializer = ResetPasswordSerializer(data=request.data)
            if serializer.is_valid():
                # Set the new password
                user.set_password(serializer.validated_data['password'])
                user.save()
                return Response({
                    "detail": "Password has been reset successfully.",
                    "user_type": getattr(user, 'user_type', None)  # Get user_type if it exists
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Invalid token or user ID."}, status=status.HTTP_400_BAD_REQUEST)
