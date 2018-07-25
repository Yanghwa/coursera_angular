import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
          transform: 'scale(1.0)',
          opacity: 1
      })),
      state('hidden', style({
          transform: 'scale(0.5)',
          opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
  ])
  ]
})
export class DishdetailComponent implements OnInit {

  @ViewChild('fform') newCommentFormDirective;

  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  newCommentForm: FormGroup;
  newComment: Comment;
  errMess: string;

  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': '',
    'date': ''
  };
  validationMessages = {
    'author': {
      'required': 'Author is required.',
      'minlength': 'Author must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.'
    },
  };

  constructor(private dishservice: DishService, private route: ActivatedRoute, private location:Location, private fb: FormBuilder, @Inject('BaseURL') private BaseURL) { 
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds, errmess => this.errMess = <any>errmess.message);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']);}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; }, errMess => { this.dish = null; this.errMess = <any>errMess;});
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm() {
    this.newCommentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', Validators.required],
      rating: 5,
      date: ''
    });

    this.newCommentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.newComment = this.newCommentForm.value;
    this.newComment.date = new Date().toISOString();
    console.log(this.newComment);
    this.dishcopy.comments.push(this.newComment);
    this.dishcopy.save().subscribe(dish => { this.dish = dish; console.log(dish); });
    this.newCommentFormDirective.resetForm();
    this.newCommentForm.reset({
      author: '',
      comment: '',
      rating: 5,
      date: ''
    });
    
  }

  onValueChanged(data?: any) {
    if(!this.newCommentForm) {
      return;
    }

    const form = this.newCommentForm;
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
