from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.conf import settings
from notifications.models import Notification  # notification model
from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send welcome email to the user
        subject = "Welcome to Agricvest 🌱"
        message = (
            f"Hi {user.username},\n\n"
            f"Welcome to Agricvest! Your account has been successfully created.\n\n"
            f"Thank you for joining us!"
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        # Send admin notification email
        admin_subject = "New User Registered on Agricvest"
        admin_message = f"A new user has registered: {user.username} ({user.email})"
        send_mail(admin_subject, admin_message, from_email, ['mjschool48@gmail.com'], fail_silently=False)

        # Create a notification in the website dashboard
        Notification.objects.create(
            user=user,
            title="Welcome to Agricvest 🌿",
            message=f"Your account has been successfully created. We're happy to have you!"
        )

        return Response(
            {'message': f'Congratulations {user.username}, your account has been created successfully!'},
            status=status.HTTP_201_CREATED
        )


class LoginView(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)

            # Create login notification
            Notification.objects.create(
                user=user,
                title="Login Successful",
                message=f"Welcome back to AgricVest, {user.username}!"
            )

            return Response({
                'message': f'Login successful - welcome to AgricVest {user.username}',
                'token': token.key
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
