import { Route } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { formGuard } from '../guards/form.guard';
import { CreateCollectionComponent } from './create-collection/create-collection.component';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { ActivePromotionsComponent } from './active-promotions/active-promotions.component';
import { CreateMessageComponent } from './create-message/create-message.component';
import { ActiveOrdersComponent } from './active-orders/active-orders.component';

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'create',
    component: CreateProductComponent,
    canDeactivate: [formGuard],
  },
  {
    path: 'edit/:productId',
    component: EditProductComponent,
    canDeactivate: [formGuard],
  },
  {
    path: 'create-collection',
    component: CreateCollectionComponent,
  },
  {
    path: 'create-discount',
    component: CreateDiscountComponent,
  },
  {
    path: 'create-message',
    component: CreateMessageComponent,
  },
  {
    path: 'active-promotions',
    component: ActivePromotionsComponent,
  },
  { path: 'add-promotion/:productId', component: AddPromotionComponent },
  { path: 'active-orders', component: ActiveOrdersComponent },
];
