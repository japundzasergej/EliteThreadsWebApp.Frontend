import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SocialService } from '../../../services/social.service';
import { AuthService } from '@auth0/auth0-angular';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-products-rating',
  standalone: true,
  imports: [NgClass],
  templateUrl: './products-rating.component.html',
  styleUrl: './products-rating.component.css',
})
export class ProductsRatingComponent  {
  @Input() ratingObject = {
    ratingCount: 0,
    ratingAvg: 0,
  };
  @Input() productId: number = 0 || 0;

  get averageRating(): number {
    return this.ratingObject.ratingAvg;
  }

  get stars(): number[] {
    return Array.from({ length: 10 }, (_, i) => i * 0.5 + 0.5);
  }
}
