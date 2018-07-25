import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private restangular: Restangular) { }

  getPromotions(): Observable<Promotion[]> {
    return this.restangular.all('promotions').getList();
  }

  getPromotion(id: number): Observable<Promotion> {
    return  this.restangular.one('promotions', id).get();
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.restangular.all('promotions').getList({featured: true}).pipe(map(promotions => promotions[0]));
  }
}
