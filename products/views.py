#  import the model, this will allow us to query the database
from .models import Product
# This serializer will convert the data received from querying the database and convert it into a python data type
from .serializers.common import ProductSerializer
# wherever we want comments to be populated on the products, we can use this instead of ProductSerializer
from .serializers.populated import PopulatedProductSerializer

# APIView is a predefined view class that allows us to set http verb methods to form our controllers
from rest_framework.views import APIView
# Response allows us to end an active request by writing to the stream and sending back headers to the client, just like the json() method in express
from rest_framework.response import Response
#  this module has a set of predefined statuses for us to use
from rest_framework import status
# This is a canned response available on Rest Framework that sends a 404 back with detail
from rest_framework.exceptions import NotFound, ValidationError
#  This will allow us to place permissions on a view. This particular class prevents unauthenticated access to non-safe methods (PUT, POST, DELETE etc)
from rest_framework.permissions import IsAuthenticatedOrReadOnly


# This "view" will be attached to one endpoint, each method inside is an independent controller for each verb attached to that endpoint. For example "get" will return back all products

# Endpoint: /products


class ProductListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    # GET ALL PRODUCTS CONTROLLER
    # Description: Return all products in products table back to user
    def get(self, _request):
        # Query the database using the model, getting all products back as a queryset
        products = Product.objects.all()
        # Once we have the queryset back, we want to serialize it, converting it into python datatype
        serialized_products = PopulatedProductSerializer(products, many=True)
        # Send a response to the user containing a JSON response with all products that were found
        #  200 is default so isn't needed to be passed here
        return Response(serialized_products.data, status.HTTP_200_OK)

    # POST A NEW PRODUCT
    # Description: Using the request body, we will attempt to add a new product to the products table
    def post(self, request):
        print(request.data)  #  this is the same as req.body in Express
        # If you have got a QuerySet that you recieved when querying the database and you need to serialize it into a python data type, then this is the instance you pass into the serializer
        # If you want to deserialize a python data type to ready it to be added into the database, pass this as the data key as below
        product_to_add = ProductSerializer(data=request.data)
        try:
            # when passing data into a serializer we get access to the is_valid() method that returns true if valid, false if not. Below we use this in an if statement, if it returns true we will save the data and send back to the user. If it fails we will send the errors back instead
            if product_to_add.is_valid():
                # if it hits here, the data passed was valid and we can now save as send a response
                print(product_to_add.validated_data)
                # the save() method can be run on a serializer instance that has a validated_data key
                product_to_add.save()
                # Once saved, we get a data key on the instance that contains the newly created record
                return Response(product_to_add.data, status.HTTP_201_CREATED)

            print(product_to_add.errors)
            return Response(product_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# Endpoint: /products/:pk
class ProductDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    # CUSTOM FUNCTION / NOT A CONTROLLER
    def get_product(self, pk):
        try:
            # Using the get() method we're searching for a record in the products table that has a primary key matching the primary key in the captured value of the request
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist as e:
            # The above exceptiom is a Django specific Model error that occurs when the requested resource does not exist.
            print(e)  #  this e variable is an object created by the DoesNotExist class. This is not serializable, so we convert to a string when sending back to the user
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET SINGLE PRODUCT
    # Description: Capture the pk passed in the url of the request, and use it to return 1 specific product
    def get(self, _request, pk):
        product = self.get_product(pk)
        # This will return a single object back, we still need to serialize it, but we don't need many=True
        serialized_product = PopulatedProductSerializer(product)
        # Finally as before we send back the serialized data
        return Response(serialized_product.data)

    # UPDATE SINGLE PRODUCT
    # Description: Take the user data and the instance and validate updates before saving
    def put(self, request, pk):
        product = self.get_product(pk)
        try:
            # We need to add both the instance and the user request body data into the serializer when updating an existing record
            # It will ask for all fields unless you add partial=True
            product_to_update = ProductSerializer(
                product, request.data, partial=True)
            if product_to_update.is_valid():
                product_to_update.save()
                return Response(product_to_update.data, status.HTTP_202_ACCEPTED)
            print(product_to_update.errors)
            return Response(product_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, _request, pk):
        product_to_delete = self.get_product(pk)
        try:
            product_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
