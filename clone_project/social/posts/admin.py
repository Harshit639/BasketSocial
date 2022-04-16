from django.contrib import admin
from posts.models import Post,comment,Like,DisLike
admin.site.register(Post)
admin.site.register(comment)
admin.site.register(Like)
admin.site.register(DisLike)
# Register your models here.
