from jwt_auth.serializers.common import UserSerializer
from orders.serializers.common import OrderSerializer


class PopulatedOrderSerializer(OrderSerializer):
    orderOwner = UserSerializer()
    # productOwner = UserSerializer()
