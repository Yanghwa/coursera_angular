import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private restangular: Restangular) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.restangular.all('feedback').post(feedback);
  }
}