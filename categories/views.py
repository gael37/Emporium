from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Category
from .serializers.populated import PopulatedCategorySerializer


class CategoryListView(APIView):

    def get(self, _request):
        categories = Category.objects.all()
        serialized_categories = PopulatedCategorySerializer(
            categories, many=True)
        return Response(serialized_categories.data)
