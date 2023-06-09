"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path # <-- added this new import re_path
from .views import index # <-- also new


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/wishes/', include('wishes.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/basket/', include('basket.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/auth/', include('jwt_auth.urls')),
    path('api/stripe/', include('payments.urls')),
    re_path(r'^.*$', index)
]
