from rest_framework import serializers
from ..models import Product  # .. goes up a level, as we use elsewhere

#  Custom Model Serializer


class ProductSerializer(serializers.ModelSerializer):
    # We'll now create a subclass called Meta that needs 2 static elements: model, fields
    class Meta:
        model = Product  # This is specifying which table/model we are serializing the data for
        fields = '__all__'  # this element accepts a tuple, list or string. To get all fields write '_all__, to get specific fields, write them as strings in a list or tuple
