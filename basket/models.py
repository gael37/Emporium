from django.db import models


class Basket(models.Model):
    #  TextField is same as CharField but it displays as a textarea in the admin system
    # auto_now_add on a DateTimeField will automatically add a timestamp to your record when it's created. We don't have to populate this ourselves in the request
    count = models.TextField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    # product = models.ForeignKey(
    #     #  This line specifies which model to build a relationship with. Syntax: appname.ModelName
    #     'products.Product',
    #     related_name='comments',
    #     on_delete=models.CASCADE
    # )
    basket_owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='basket',
        on_delete=models.CASCADE
    )
    product_added_to_basket = models.ForeignKey(
        'products.Product',
        related_name='added_to_basket',
        on_delete=models.CASCADE
    )
    


# ForeignKey fields define a OneToMany relationship behind the scenes
# To create one we need to specify at least 2 fields:
# 1. The exact model to build the relationship with
# 2. related_name, which is what all the comments will show up under on a populated book query
# Optionally you can have a third key, detailing whether or not to delete all the comments when the related book is deleted
# 3. To Cascade all the comments, set the on_delete key to models.CASCADE
