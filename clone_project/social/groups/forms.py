from django import forms
from groups.models import Group


class GroupForm(forms.ModelForm):

    class Meta():
        model=Group
        fields=('name','description')

        widgets={ 'name': forms.TextInput(attrs={'class': 'form-control editable medium-editor-textarea postcontent','style': 'background-color:rgba(0, 0, 0, 0); color:white;'}), 'description': forms.Textarea(attrs={'class': 'form-control editable medium-editor-textarea postcontent','style': 'background-color:rgba(0, 0, 0, 0); color:white; '})}
