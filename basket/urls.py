from django.urls import path
from .views import BasketListView, BasketDetailView

# Endpoint that hits this file: /basket/
urlpatterns = [
    path('', BasketListView.as_view()),
    path('<int:pk>/', BasketDetailView.as_view())
]
