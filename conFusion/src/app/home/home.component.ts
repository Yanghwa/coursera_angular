import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish:Dish;
  promotion:Promotion;
  leader:Leader;
  dishErrMess: string;
  leaderErrMess: string;
  promoErrMess: string;

  constructor(private dishservice: DishService, private promotionservice: PromotionService, private leaderService: LeaderService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish, dishErrMess => this.dishErrMess = <any>dishErrMess.message);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, promoErrMess => this.promoErrMess = <any>promoErrMess.message);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader, leaderErrMess => this.leaderErrMess = <any>leaderErrMess.message);
  }

}
