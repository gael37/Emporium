from jwt_auth.serializers.common import UserSerializer
from comments.serializers.common import CommentSerializer


class PopulatedCommentSerializer(CommentSerializer):
    comment_owner = UserSerializer()
    
