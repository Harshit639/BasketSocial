from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin,PermissionRequiredMixin
from django.urls import reverse
from django.views import generic
from groups.models import Group,GroupMember
# Create your views here.
from django.shortcuts import get_object_or_404, get_list_or_404
from django.contrib import messages
from groups.forms import GroupForm

class CreateGroup(LoginRequiredMixin,generic.CreateView):
    form_class=GroupForm

    model=Group


class SingleGroup(generic.DetailView):
    model=Group

class ListGroups(generic.ListView):
    model=Group

class JoinGroup(LoginRequiredMixin,generic.RedirectView):

    def get_redirect_url(self,*args,**kwargs):
        return reverse("groups:single",kwargs={'slug':self.kwargs.get('slug')})

    def get(self,request,*args,**kwargs):
        group=get_object_or_404(Group, slug=self.kwargs.get('slug'))
        created = GroupMember.objects.create(user=request.user, group=group)
        if not created:
            messages.warning(request, 'already a member!')
        else:
            messages.success(request, 'You are now a member!')
        return super().get(request, *args, **kwargs)
        # try:
        #     GroupMember.objects.create(user=self.request.user,group=group)
        # except IntegrityError:
        #     messages.warning(self.request,("warning aslready a member"))
        #
        # else:
        #     messages.warning(self.request,'You are now a member')
        #
        # return super().get(request,*args,**kwargs)

class LeaveGroup(LoginRequiredMixin,generic.RedirectView):

    def get_redirect_url(self,*args,**kwargs):
        return reverse("groups:single",kwargs={'slug':self.kwargs.get('slug')})

    def get(self,request,*args,**kwargs):

        try:
            membership=GroupMember.objects.filter(user=self.request.user, group__slug=self.kwargs.get('slug'))
        except GroupMember.DoesNotExist:
            messages.warning(self.request,'sorry you are not in this group')

        else:
            membership.delete()
            messages.success(self.request,'You have left this group')
        return super().get(request,*args,**kwargs)
