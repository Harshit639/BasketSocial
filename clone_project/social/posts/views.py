from django.shortcuts import render,get_object_or_404,redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.http import Http404
from django.views import generic
from braces.views import SelectRelatedMixin

from . import models
from . import forms
from django.contrib import messages
from django.contrib.auth import get_user_model
from posts.forms import PostForm,CommentForm
from posts.models import Post
User=get_user_model()
# Create your views here.

class PostList(SelectRelatedMixin,generic.ListView):
    model=models.Post
    select_related=('user','group')


class UserPost(generic.ListView):
    model=models.Post
    template_name='posts/user_post_list.html'

    def get_queryset(self):
        try:
            self.post_user=User.objects.prefetch_related('posts').get(username__iexact=self.kwargs.get('username'))
        except User.DoesNotExist:
            raise Http404
        else:
            return self.post_user.posts.all()

    def get_context_data(self,**kwargs):
        context=super().get_context_data(**kwargs)
        context['post_user']=self.post_user
        return context

class PostDetail(SelectRelatedMixin,generic.DetailView):
    model=models.Post
    select_related=('user','group')

    def get_queryset(self):
        queryset=super().get_queryset()
        return queryset.filter(user__username__iexact=self.kwargs.get('username'))

# class CreatePost(LoginRequiredMixin,SelectRelatedMixin,generic.CreateView):
#     fields=('message','group')
#     model=models.Post
#
#     def form_valid(self,form):
#         self.object=form.save(commit=False)
#         self.object.user=self.request.user
#         self.object.save()
#         return super().form_valid(form)

class CreatePost(LoginRequiredMixin,SelectRelatedMixin,generic.CreateView):
    login_url= '/login/'
    form_class=PostForm
    model=Post
    def form_valid(self,form):
        self.object=form.save(commit=False)
        self.object.user=self.request.user
        self.object.save()
        return super().form_valid(form)

class DeletePost(LoginRequiredMixin,SelectRelatedMixin,generic.DeleteView):
    model=models.Post
    select_related=('user','group')
    success_url=reverse_lazy('groups:all')

    def get_queryset(self):
        queryset=super().get_queryset()
        return queryset.filter(user_id=self.request.user.id)

    def delete(self,*args,**kwargs):
        messages.success(self.request,'Post Deleted')
        return super().delete(*args,**kwargs)



def add_comment_to_post(request,pk,username):
    post=get_object_or_404(Post,pk=pk)
    if request.method =='POST':
        form=CommentForm(request.POST)
        if form.is_valid():
            comment=form.save(commit=False)
            comment.post=post
            comment.save()
            return redirect('groups:all')
    else:
        form=CommentForm()
    return render(request,'posts/comment_form.html',{'form':form})
