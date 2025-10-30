from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


# Serializer to view user info
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role']


# Serializer for registration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'phone', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user_instance = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            role=validated_data['role'],
        )
        user_instance.set_password(validated_data['password'])
        user_instance.save()
        return user_instance


# Serializer for login
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)  # could also use email
    password = serializers.CharField(write_only=True, required=True)
    
