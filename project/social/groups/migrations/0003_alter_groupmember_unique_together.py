# Generated by Django 3.2.5 on 2022-03-22 13:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0002_rename_member_group_members'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='groupmember',
            unique_together=set(),
        ),
    ]