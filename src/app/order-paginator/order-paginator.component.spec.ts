import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaginatorComponent } from './order-paginator.component';

describe('OrderPaginatorComponent', () => {
  let component: OrderPaginatorComponent;
  let fixture: ComponentFixture<OrderPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPaginatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
