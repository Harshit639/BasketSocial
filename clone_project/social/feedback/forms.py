from django import forms
from feedback.models import feedback


class fForm(forms.ModelForm):

    class Meta():
        model=feedback
        fields=('email','message',)

        widgets={ 'message': forms.Textarea(attrs={'class': 'form-control editable medium-editor-textarea postcontent','style': 'background-color:rgba(0, 0, 0, 0); color:white;'}), 'email': forms.TextInput(attrs={'class': 'form-control editable medium-editor-textarea postcontent','style': 'background-color:rgba(0, 0, 0, 0); color:white; '})}
