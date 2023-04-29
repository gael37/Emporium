from jwt_auth.serializers.common import UserSerializer
from basket.serializers.common import BasketSerializer
from products.serializers.common import ProductSerializer


class PopulatedBasketSerializer(BasketSerializer):
    basket_owner = UserSerializer()
    product_added_to_basket = ProductSerializer()
