from .common import UserSerializer
from products.serializers.populated import PopulatedProductSerializer
# from categories.serializers.common import CategorySerializer
from comments.serializers.populated import PopulatedCommentSerializer
from wishes.serializers.populated import PopulatedWishSerializer
from orders.serializers.populated import PopulatedOrderSerializer
from comments.serializers.common import CommentSerializer
from wishes.serializers.common import WishSerializer
from orders.serializers.common import OrderSerializer


class PopulatedUserSerializer(UserSerializer):
    # Just like when we use the serializer in the controllers, if the field we're populating here is a list then we need to use many=True
    products = PopulatedProductSerializer(many=True)
    comments = PopulatedCommentSerializer(many=True)
    wishes = PopulatedWishSerializer(many=True)
    orders = PopulatedOrderSerializer(many=True)
    # products_liked = PopulatedProductSerializer(many=True)