# Generated by Django 4.1.5 on 2023-04-26 14:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0002_remove_payment_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='basket',
        ),
    ]
