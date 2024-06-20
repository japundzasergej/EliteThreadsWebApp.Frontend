import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { inject } from '@angular/core';
import { RatingResolveService } from './products/detail/services/rating-resolve.service';
import { infoRequiredGuard } from './guards/info-required.guard';
import { formGuard } from './guards/form.guard';
import { PersonalInfoResolveService } from './personal-info/services/personal-info-resolve.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (mod) => mod.AdminDashboardComponent
      ),
    loadChildren: () =>
      import('./admin-dashboard/admin.routes').then((mod) => mod.ADMIN_ROUTES),
    canMatch: [roleGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((mod) => mod.LandingComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then(
        (mod) => mod.ProductsComponent
      ),
    children: [
      {
        path: 'detail/:productId',
        loadComponent: () =>
          import('./products/detail/detail.component').then(
            (mod) => mod.DetailComponent
          ),
        children: [
          {
            path: 'review',
            loadComponent: () =>
              import('./products/detail/review/review.component').then(
                (mod) => mod.ReviewComponent
              ),
            resolve: {
              rating: () => inject(RatingResolveService).returnRating(),
            },
            loadChildren: () =>
              import('./products/detail/review/review.routes').then(
                (mod) => mod.routes
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'user-profile/:userId',
    loadComponent: () =>
      import('./profile/profile.component').then((mod) => mod.ProfileComponent),
  },
  {
    path: 'wishlist/:userId',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then(
        (mod) => mod.WishlistComponent
      ),
  },
  {
    path: 'shopping-cart/:userId',
    loadComponent: () =>
      import('./shopping-cart/shopping-cart.component').then(
        (mod) => mod.ShoppingCartComponent
      ),
  },
  {
    path: 'checkout/:orderId',
    loadComponent: () =>
      import('./checkout/checkout.component').then(
        (mod) => mod.CheckoutComponent
      ),
    canMatch: [infoRequiredGuard],
  },
  {
    path: 'checkout/:orderId',
    loadComponent: () =>
      import('./personal-info/personal-info.component').then(
        (mod) => mod.PersonalInfoComponent
      ),
    canDeactivate: [formGuard],
  },
  {
    path: 'payment-successful',
    loadComponent: () =>
      import('./payment-successful/payment-successful.component').then(
        (mod) => mod.PaymentSuccessfulComponent
      ),
  },
  {
    path: 'payment-failed',
    loadComponent: () =>
      import('./payment-failed/payment-failed.component').then(
        (mod) => mod.PaymentFailedComponent
      ),
  },
  {
    path: 'edit-personal-info/:orderId',
    loadComponent: () =>
      import('./personal-info/personal-info.component').then(
        (mod) => mod.PersonalInfoComponent
      ),
    resolve: {
      isEditable: () => inject(PersonalInfoResolveService).pageIsEditable(),
    },
  },
  {
    path: 'active-orders/:userId',
    loadComponent: () =>
      import('./user-orders/user-orders.component').then(
        (mod) => mod.UserOrdersComponent
      ),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./unauthorized/unauthorized.component').then(
        (mod) => mod.UnauthorizedComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (mod) => mod.NotFoundComponent
      ),
  },
];
