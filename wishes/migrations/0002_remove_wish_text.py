# Generated by Django 4.1.5 on 2023-04-18 13:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wishes', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wish',
            name='text',
        ),
    ]
