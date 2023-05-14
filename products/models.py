from django.db import models
import datetime
# Create your models here.


class Product(models.Model):
    description = models.CharField(max_length=10000)
    price = models.CharField(max_length=150)
    images = models.CharField(max_length=10000)
    created_at = models.DateTimeField(
        auto_now_add=True)
    dimensions = models.CharField(
        max_length=500, default=None, blank=True, null=True)
    weight = models.CharField(
        max_length=500, default=None, blank=True, null=True)
    about = models.CharField(
        max_length=10000, default=None, blank=True, null=True)
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='products',
        on_delete=models.CASCADE
    )
    stripe_id = models.CharField(max_length=300, default=None, blank=True, null=True)
    categories = models.ManyToManyField(
        'categories.Category',
        related_name="products"
    )
    # likers = models.ManyToManyField(
    #     'jwt_auth.User',
    #     related_name="products_liked",
    #     default=None,
    #     blank=True,
    #     null=True
    # )

    def __str__(self):
        return f"{self.description}"
