from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated


from .serializers.common import BasketSerializer
from .serializers.populated import PopulatedBasketSerializer
from .models import Basket


# Endpoint: /basket/
class BasketListView(APIView):
    permission_classes = (IsAuthenticated, )

    # GET ALL BASKETS
    def get(self, _request):
        # Query the database using the model, getting all products back as a queryset
        basket = Basket.objects.all()
        # Once we have the queryset back, we want to serialize it, converting it into python datatype
        serialized_basket = PopulatedBasketSerializer(basket, many=True)
        # Send a response to the user containing a JSON response with all products that were found
        #  200 is default so isn't needed to be passed here
        return Response(serialized_basket.data, status.HTTP_200_OK)
    

    # CREATE A BASKET
    def post(self, request):
        try:
            basket_to_add = BasketSerializer(data=request.data)
            if basket_to_add.is_valid():
                basket_to_add.save()
                return Response(basket_to_add.data, status.HTTP_201_CREATED)
            return Response(basket_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# Endpoint: /basket/<int:pk>/
class BasketDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    # DELETE BASKET
    
    def delete(self, _request, pk):
        try:
            basket_to_delete = Basket.objects.get(pk=pk)
            basket_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Basket.DoesNotExist as e:
            print(e)
            raise NotFound(str(e))

    # CUSTOM FUNCTION / NOT A CONTROLLER
    
    def get_basket(self, pk):
        try:
            return Basket.objects.get(pk=pk)
        except Basket.DoesNotExist as e:
            print(e)  
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    # GET SINGLE WISH
    def get(self, _request, pk):
        basket = self.get_basket(pk)
        serialized_basket = PopulatedBasketSerializer(basket)
        return Response(serialized_basket.data)

# UPDATE SINGLE BASKET
    def put(self, request, pk):
        basket = self.get_basket(pk)
        try:
            basket_to_update = BasketSerializer(
                basket, request.data, partial=True)
            if basket_to_update.is_valid():
                basket_to_update.save()
                return Response(basket_to_update.data, status.HTTP_202_ACCEPTED)
            print(basket_to_update.errors)
            return Response(basket_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)