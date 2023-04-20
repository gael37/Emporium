from django.urls import path
from .views import CommentListView, CommentDetailView

# Endpoint that hits this file: /comments/
urlpatterns = [
    path('', CommentListView.as_view()),
    path('<int:pk>/', CommentDetailView.as_view())
]
