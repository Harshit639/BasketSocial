from django import forms
from posts.models import Post,comment




class PostForm(forms.ModelForm):

    class Meta():
        model=Post
        fields=('message','group',)

        widgets={ 'message': forms.Textarea(attrs={'class': 'form-control editable medium-editor-textarea postcontent','style': 'background-color:rgba(0, 0, 0, 0); color:white;'})}


class CommentForm(forms.ModelForm):

    class Meta():
        model=comment
        fields=('author', 'text',)

    widgets={ 'author':forms.TextInput(attrs={'class': 'textinputclass'}),'text': forms.Textarea(attrs={'class': 'editable medium-editor-textarea'})}
