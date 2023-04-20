from django.db import models
from django.contrib.auth.models import AbstractUser
# AbstractUser brings in a fully functioning user model that we can add to
# AbstractBaseUser allows you to build the user model again from scratch

# Create your models here.

# Making a field nullable, we need 3 keyword args to be applied to the field
# default: default=None - this provides a default value that will be input into any existing records in the database
# blank: blank=True - setting blank to True allows you to leave this field off of any request to create a record in the table
# null: null=True - this instructs the database to make this field nullable


class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True)
    profile_image = models.CharField(
        max_length=300, default=None, blank=True, null=True)
    postcode = models.CharField(max_length=50)
    image = models.CharField(
        max_length=300, default=None, blank=True, null=True)
    likes = models.CharField(
        max_length=300, default=None, blank=True, null=True)
