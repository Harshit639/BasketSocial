from django.urls import path
from . import views
app_name= 'posts'

urlpatterns=[
             path('',views.PostList.as_view(),name='all'),
             path('new/',views.CreatePost.as_view(),name='create'),
             path('by/<username>/',views.UserPost.as_view(),name='for_user'),
             path('by/<username>/<pk>',views.PostDetail.as_view(),name='single'),
             path('by/<username>/<pk>/comment',views.add_comment_to_post,name='add_comment_to_post'),
             path('delete/<pk>',views.DeletePost.as_view(),name='delete'),

]
