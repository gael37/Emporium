import jwt
from django.conf import settings
# BaseAuthentication is the class that we extend when we want to build custom authentication behaviour
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
User = get_user_model()


# We'll extend BaseAuthentication and override the authenticate method
# the authenticate method requires a successfull authentication to return a two-tuple containing the user verified and the token
# If verification fails, return None

class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):

        # 1. Check headers exists
        if not request.headers:
            print('NO HEADERS PRESENT')
            return None  # This will invalidate the request for routes with authenticated permissions, and it will prevent a 500 internal server error where the routes don't have authentication

        # 2. Authorization header exists
        headers = request.headers.get('Authorization')
        if not headers:
            print('AUTHORIZATION HEADER NOT PRESENT')
            return None

        # 3. We ensure it's a Bearer token
        if not headers.startswith('Bearer '):
            print('INVALID TOKEN FORMAT')
            raise PermissionDenied('Invalid Token')

        # 4. Remove Bearer & space from the Authorization header, saving just the token to a variable
        token = headers.replace('Bearer ', '')
        print('TOKEN ->', token)

        try:
            # 5. Using JWT method to verify the token is valid, also extracting the payload in the process
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=['HS256'])

            # 6. Using the sub on the payload (user id), we're going to query the User table to find a match. If there's a match, the user is verified, if there's not, we'll invalidate the request
            user = User.objects.get(pk=payload['sub'])
            print(user)
        except User.DoesNotExist as e:
            raise PermissionDenied('User not found')
        except Exception as e:
            print(e)
            raise PermissionDenied(str(e))

        # 7. return a two-tuple containing the user object we found in the database, and the token used to verify them
        return (user, token)
