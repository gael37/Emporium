from jwt_auth.serializers.common import UserSerializer
from wishes.serializers.common import WishSerializer


class PopulatedWishSerializer(WishSerializer):
    wishOwner = UserSerializer()
    # productOwner = UserSerializer()
