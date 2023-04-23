from jwt_auth.serializers.common import UserSerializer
from wishes.serializers.common import WishSerializer
from products.serializers.common import ProductSerializer


class PopulatedWishSerializer(WishSerializer):
    wish_owner = UserSerializer()
    # productOwner = UserSerializer()
    product_wished = ProductSerializer()
