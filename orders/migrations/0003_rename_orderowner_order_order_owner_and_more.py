# Generated by Django 4.1.5 on 2023-04-21 17:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_order_count'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='orderOwner',
            new_name='order_owner',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='productOrdered',
            new_name='product_ordered',
        ),
    ]
