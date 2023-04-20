from django.urls import path
from .views import OrderListView, OrderDetailView

# Endpoint that hits this file: /orders/
urlpatterns = [
    path('', OrderListView.as_view()),
    path('<int:pk>/', OrderDetailView.as_view())
]
