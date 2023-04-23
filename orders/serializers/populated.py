from jwt_auth.serializers.common import UserSerializer
from orders.serializers.common import OrderSerializer
from products.serializers.common import ProductSerializer


class PopulatedOrderSerializer(OrderSerializer):
    order_owner = UserSerializer()
    # productOwner = UserSerializer()
    product_ordered = ProductSerializer()
