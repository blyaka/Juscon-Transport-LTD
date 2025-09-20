from django import forms
from django.core.validators import RegexValidator, EmailValidator

phone_rx = RegexValidator(
    regex=r'^\+7 \d{3} \d{3} \d{2} \d{2}$',
    message='Формат: +7 900 000 00 00'
)

class FeedbackForm(forms.Form):
    name = forms.CharField(max_length=80)
    company = forms.CharField(max_length=120, required=False)
    phone = forms.CharField(validators=[phone_rx])
    email = forms.EmailField(validators=[EmailValidator()])
    comment = forms.CharField(widget=forms.Textarea, required=False)
    consent = forms.BooleanField()

    hp = forms.CharField(required=False)
    ts = forms.IntegerField(required=False, min_value=0)

    def clean_hp(self):
        v = (self.cleaned_data.get('hp') or '').strip()
        if v:
            raise forms.ValidationError('spam')
        return v

    def clean_ts(self):
        return self.cleaned_data.get('ts') or 0
