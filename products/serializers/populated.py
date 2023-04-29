from .common import ProductSerializer
from comments.serializers.populated import PopulatedCommentSerializer
from wishes.serializers.populated import PopulatedWishSerializer
from orders.serializers.populated import PopulatedOrderSerializer
from categories.serializers.common import CategorySerializer
from jwt_auth.serializers.common import UserSerializer
from comments.serializers.common import CommentSerializer
from wishes.serializers.common import WishSerializer
from orders.serializers.common import OrderSerializer
from basket.serializers.common import BasketSerializer
from basket.serializers.populated import PopulatedBasketSerializer


class PopulatedProductSerializer(ProductSerializer):
    # Just like when we use the serializer in the controllers, if the field we're populating here is a list then we need to use many=True
    owner = UserSerializer()
    categories = CategorySerializer(many=True)
    comments = PopulatedCommentSerializer(many=True)
    wished = PopulatedWishSerializer(many=True)
    ordered = PopulatedOrderSerializer(many=True)
    added_to_basket = PopulatedBasketSerializer(many=True)