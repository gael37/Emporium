from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated


from .serializers.common import OrderSerializer
from .serializers.populated import PopulatedOrderSerializer
from .models import Order


# Endpoint: /orders/
class OrderListView(APIView):
    permission_classes = (IsAuthenticated, )

    # GET ALL ORDERS
    def get(self, _request):
        # Query the database using the model, getting all products back as a queryset
        orders = Order.objects.all()
        # Once we have the queryset back, we want to serialize it, converting it into python datatype
        serialized_orders = PopulatedOrderSerializer(orders, many=True)
        # Send a response to the user containing a JSON response with all products that were found
        #  200 is default so isn't needed to be passed here
        return Response(serialized_orders.data, status.HTTP_200_OK)
    

    # CREATE A ORDER
    def post(self, request):
        try:
            order_to_add = OrderSerializer(data=request.data)
            if order_to_add.is_valid():
                order_to_add.save()
                return Response(order_to_add.data, status.HTTP_201_CREATED)
            return Response(order_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# Endpoint: /orders/<int:pk>/
class OrderDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    # DELETE ORDER
    
    def delete(self, _request, pk):
        try:
            order_to_delete = Order.objects.get(pk=pk)
            order_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist as e:
            print(e)
            raise NotFound(str(e))

    # CUSTOM FUNCTION / NOT A CONTROLLER
    
    def get_order(self, pk):
        try:
            return Order.objects.get(pk=pk)
        except Order.DoesNotExist as e:
            print(e)  
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    # GET SINGLE WISH
    def get(self, _request, pk):
        order = self.get_order(pk)
        serialized_order = PopulatedOrderSerializer(order)
        return Response(serialized_order.data)

# UPDATE SINGLE ORDER
    def put(self, request, pk):
        order = self.get_order(pk)
        try:
            order_to_update = OrderSerializer(
                order, request.data, partial=True)
            if order_to_update.is_valid():
                order_to_update.save()
                return Response(order_to_update.data, status.HTTP_202_ACCEPTED)
            print(order_to_update.errors)
            return Response(order_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)