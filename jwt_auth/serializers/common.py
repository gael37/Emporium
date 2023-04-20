from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation, hashers
from django.core.exceptions import ValidationError

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    # lines below ensure that when the data from users is serialized, password and password_confirmation do not exist on the JSON
    # write_only tells the serializer to allow write actions on this field but not to return the field in serialized results
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    # Validate method will:
    # 1. Check password matches password_confirmation
    # 2. validate the password
    # 3. hash the password
    def validate(self, data):
        print('data ->', data)

        # pop method removes the password key from the data object, saving it to a variable, we'll add it back later hashed
        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        # check if the passwords match
        if password != password_confirmation:
            raise ValidationError({
                'password_confirmation': 'Does not match the password field'
            })

        # Validating the password
        password_validation.validate_password(password)

        # Hash the password and put it back on the data object and return the data object to the function
        data['password'] = hashers.make_password(password)

        return data  # validate method requires you to return back the user data at the end. If it's been manipulated during the validate method executing, the updated version will be returned and stored

    class Meta:
        model = User
        fields = '__all__'
