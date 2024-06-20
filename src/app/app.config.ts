import { ApplicationConfig, ErrorHandler, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LocalStorageCache, provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { APP_CONFIG, APP_CONFIG_SERVICE } from './appconfig/app.config.service';
import { requestInterceptor } from './interceptors/request.interceptor';
import { GlobalErrorHandler } from './middleware/error-handler.service';
import { CreateReviewResolveService } from './products/detail/review/services/create-review-resolve.service';
import { EditReviewResolveService } from './products/detail/review/services/edit-review-resolve.service';
import { UserIdResolveService } from './products/detail/review/services/user-id-resolve.service';
import { RatingResolveService } from './products/detail/services/rating-resolve.service';
import { LoaderService } from './services/loader.service';
import { LocalService } from './services/local.service';
import { PromotionsService } from './services/promotions.service';
import { ToasterService } from './toaster/services/toaster.service';
import { OrderService } from './services/order.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAuth0({
      domain: APP_CONFIG.domain,
      clientId: APP_CONFIG.clientId,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    provideAnimationsAsync(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideHttpClient(withInterceptors([requestInterceptor])),
    LocalService,
    LoaderService,
    {
      provide: APP_CONFIG_SERVICE,
      useValue: APP_CONFIG,
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    RatingResolveService,
    EditReviewResolveService,
    CreateReviewResolveService,
    ToasterService,
    PromotionsService,
    UserIdResolveService,
    LocalStorageCache,
    OrderService
  ],
};
