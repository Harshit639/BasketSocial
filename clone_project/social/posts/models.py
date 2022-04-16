from django.db import models
from django.urls import reverse
from django.conf import settings
import misaka
from groups.models import Group

from django.contrib.auth import get_user_model
User=get_user_model()

# Create your models here.

class Post(models.Model):
    user=models.ForeignKey(User,related_name='posts',on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now=True)
    message=models.TextField()
    message_html=models.TextField(editable=False)
    group=models.ForeignKey(Group,related_name='posts',null=True,blank=True,on_delete=models.CASCADE)

    def get_total_likes(self):
        return self.likes.users.count()

    def get_total_dis_likes(self):
        return self.dis_likes.users.count()



    def __str__(self):
        return self.message

    def save(self,*args,**kwargs):
        self.message_html=misaka.html(self.message)
        super().save(*args,**kwargs)

    def get_absolute_url(self):
        return reverse('posts:single',kwargs={'username':self.user.username,'pk':self.pk})

    class Meta:
        ordering=['-created_at']

class comment(models.Model):
    post=models.ForeignKey('posts.Post',related_name='comments',on_delete=models.CASCADE)
    author=models.CharField(max_length=200)
    text=models.TextField()
    published_date=models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        return reverse('group_detail')

    # def publish(self):
    #     self.published_date=timezone.now()
    #     self.save();


class Like(models.Model):
    coment = models.OneToOneField(Post, related_name="likes", on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='requirement_comment_likes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class DisLike(models.Model):
    coment = models.OneToOneField(Post, related_name="dis_likes", on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='requirement_comment_dis_likes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
