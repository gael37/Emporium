from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated


from .serializers.common import CommentSerializer
from .serializers.populated import PopulatedCommentSerializer
from .models import Comment


# Endpoint: /comments/
class CommentListView(APIView):
    permission_classes = (IsAuthenticated, )

    # CREATE A COMMENT
    def post(self, request):
        try:
            comment_to_add = CommentSerializer(data=request.data)
            if comment_to_add.is_valid():
                comment_to_add.save()
                return Response(comment_to_add.data, status.HTTP_201_CREATED)
            return Response(comment_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)


# Endpoint: /comments/<int:pk>/
class CommentDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    # DELETE COMMENT
    def delete(self, _request, pk):
        try:
            comment_to_delete = Comment.objects.get(pk=pk)
            comment_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist as e:
            print(e)
            raise NotFound(str(e))

     # CUSTOM FUNCTION / NOT A CONTROLLER
    def get_comment(self, pk):
        try:
            # Using the get() method we're searching for a record in the products table that has a primary key matching the primary key in the captured value of the request
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist as e:
            # The above exceptiom is a Django specific Model error that occurs when the requested resource does not exist.
            print(e)  #  this e variable is an object created by the DoesNotExist class. This is not serializable, so we convert to a string when sending back to the user
            raise NotFound(str(e))
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET SINGLE PRODUCT
    # Description: Capture the pk passed in the url of the request, and use it to return 1 specific product
    def get(self, _request, pk):
        comment = self.get_comment(pk)
        # This will return a single object back, we still need to serialize it, but we don't need many=True
        serialized_comment = PopulatedCommentSerializer(comment)
        # Finally as before we send back the serialized data
        return Response(serialized_comment.data)
