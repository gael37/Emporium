from django.db import models
import datetime
# Create your models here.


class Payment(models.Model):
    
    stripe_id = models.CharField(max_length=1000)
    created_at = models.DateTimeField(
        auto_now_add=True)