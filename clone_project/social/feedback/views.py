from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from feedback.models import feedback
from django.views import generic
from feedback.forms import fForm
# Create your views here.
class CreateFeedback(generic.CreateView):

    form_class=fForm
    model=feedback
    # def form_valid(self,form):
    #     self.object=form.save(commit=False)
    #     self.object.user=self.request.user
    #     self.object.save()
    #     return super().form_valid(form)
