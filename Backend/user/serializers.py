from rest_framework import serializers

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, min_length=4)
    confirm_password = serializers.CharField(write_only=True, required=True, min_length=4)

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def validate_password(self, value):
        # Add any additional password validation rules here if necessary
        return value

