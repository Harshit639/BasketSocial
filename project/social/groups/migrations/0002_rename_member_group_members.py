# Generated by Django 3.2.5 on 2022-03-22 13:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='group',
            old_name='member',
            new_name='members',
        ),
    ]