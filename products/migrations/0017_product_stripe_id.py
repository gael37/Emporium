# Generated by Django 4.1.5 on 2023-04-27 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0016_alter_product_about_alter_product_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='stripe_id',
            field=models.CharField(default=1, max_length=300),
            preserve_default=False,
        ),
    ]
