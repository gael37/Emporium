from django.urls import path
from .views import ProductListView, ProductDetailView

# for every endpoint you want to create, create a new path
# /products/
urlpatterns = [
    # endpoint is left as an empty string because it's already the correct endpoint for this view when it hits this file. Endpoint: /products/
    path('', ProductListView.as_view()),
    path('<int:pk>/', ProductDetailView.as_view())
]
# The above id capture is known as a caputured value and is made up of two parts
# On the left, before the colon, we specify the data type of the value being passed. In this case, it will be an int.
# On the right hand side, we name the placeholder that we'll later be able to capture in the controller
