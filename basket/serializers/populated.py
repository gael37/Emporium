from jwt_auth.serializers.common import UserSerializer
from basket.serializers.common import BasketSerializer


class PopulatedBasketSerializer(BasketSerializer):
    basket_owner = UserSerializer()
    # productOwner = UserSerializer()
