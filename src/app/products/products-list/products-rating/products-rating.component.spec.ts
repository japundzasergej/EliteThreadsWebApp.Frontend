import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsRatingComponent } from './products-rating.component';

describe('ProductsRatingComponent', () => {
  let component: ProductsRatingComponent;
  let fixture: ComponentFixture<ProductsRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsRatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
