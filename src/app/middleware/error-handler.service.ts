import { ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ToasterService } from '../toaster/services/toaster.service';

export class GlobalErrorHandler extends ErrorHandler {
  private readonly toast = inject(ToasterService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  override handleError(error: any): void {
    if (error) {
      let errorMessage = '';
      switch (error.status) {
        case 404:
          this.router.navigate(['/not-found']);
          break;
        case 400:
          if (error.error && error.error.errors) {
            const validationErrors = error.error.errors;
            errorMessage = validationErrors
              .map((err: any) => `${err.propertyName}: ${err.errorMessage}`)
              .join('\n');
          } else {
            errorMessage = 'Bad request.';
          }
          break;
        case 401:
          this.auth.loginWithRedirect();
          break;
        case 403:
          this.router.navigate(['/unauthorized']);
          break;
        default:
          errorMessage = 'Oops! Something went wrong.';
      }
      console.log(error);

      this.toast.showToastError(errorMessage);
    }
  }
}
