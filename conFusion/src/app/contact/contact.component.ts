import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

import { visibility, flyInOut, expand } from '../animations/app.animation';

import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };
  errMess: string;

  visibility = 'shown';
  feedbackVisibility = 'hidden';
  resFeedback: Feedback;

  validationMessages = {
    'firstname': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be at least 2 characters long.',
      'maxlength': 'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be at least 2 characters long.',
      'maxlength': 'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    },
  };

  constructor(private feedbackservice: FeedbackService, private fb: FormBuilder, @Inject('BaseURL') private BaseURL) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.visibility = 'hidden';
    this.feedbackVisibility = 'shown';
    this.feedbackservice.submitFeedback(this.feedback).subscribe(feedback => {
      this.resFeedback = feedback;
      setInterval(()=>{this.visibility = 'shown';this.feedbackVisibility = 'hidden';}, 5000);
    }, errMess => this.errMess = <any>errMess);
    this.feedbackFormDirective.resetForm();
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    
  }

  onValueChanged(data?: any) {
    if(!this.feedbackForm) {
      return;
    }

    const form = this.feedbackForm;
    for(const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for(const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
