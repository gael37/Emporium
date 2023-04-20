from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_exempt


from .serializers.common import WishSerializer
from .serializers.populated import PopulatedWishSerializer
from .models import Wish


# Endpoint: /wishes/
class WishListView(APIView):
    permission_classes = (IsAuthenticated, )

    # GET ALL WISHES
    def get(self, _request):
        # Query the database using the model, getting all products back as a queryset
        wishes = Wish.objects.all()
        # Once we have the queryset back, we want to serialize it, converting it into python datatype
        serialized_wishes = PopulatedWishSerializer(wishes, many=True)
        # Send a response to the user containing a JSON response with all products that were found
        #  200 is default so isn't needed to be passed here
        return Response(serialized_wishes.data, status.HTTP_200_OK)
    

    # CREATE A WISH
    def post(self, request):
        try:
            wish_to_add = WishSerializer(data=request.data)
            if wish_to_add.is_valid():
                wish_to_add.save()
                return Response(wish_to_add.data, status.HTTP_201_CREATED)
            return Response(wish_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# Endpoint: /wishes/<int:pk>/
class WishDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    # DELETE WISH
    
    def delete(self, _request, pk):
        try:
            wish_to_delete = Wish.objects.get(pk=pk)
            wish_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wish.DoesNotExist as e:
            print(e)
            raise NotFound(str(e))

    # CUSTOM FUNCTION / NOT A CONTROLLER
    
    def get_wish(self, pk):
        try:
            return Wish.objects.get(pk=pk)
        except Wish.DoesNotExist as e:
            print(e)  
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    # GET SINGLE WISH
    def get(self, _request, pk):
        wish = self.get_wish(pk)
        serialized_wish = PopulatedWishSerializer(wish)
        return Response(serialized_wish.data)
