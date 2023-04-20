from jwt_auth.serializers.common import UserSerializer
from comments.serializers.common import CommentSerializer


class PopulatedCommentSerializer(CommentSerializer):
    commentOwner = UserSerializer()
    productOwner = UserSerializer()
