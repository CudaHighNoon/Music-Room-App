# Generated by Django 5.1.4 on 2025-01-12 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_room_current_song'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='names',
            field=models.CharField(default='', max_length=50),
        ),
    ]
