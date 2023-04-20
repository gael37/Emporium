from django.urls import path
from .views import WishListView, WishDetailView

# Endpoint that hits this file: /wishes/
urlpatterns = [
    path('', WishListView.as_view()),
    path('<int:pk>/', WishDetailView.as_view())
]
