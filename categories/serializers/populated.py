from .common import CategorySerializer
from products.serializers.common import ProductSerializer


class PopulatedCategorySerializer(CategorySerializer):
    products = ProductSerializer(many=True)
