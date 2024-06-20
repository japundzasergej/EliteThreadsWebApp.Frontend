import { inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanDeactivateFn } from '@angular/router';

export interface FormComponent {
  formGroup: FormGroup;
  formSubmitted: boolean;
}

export const formGuard: CanDeactivateFn<FormComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const snackbar = inject(MatSnackBar);
  if (component.formGroup.pristine || component.formSubmitted) {
    return true;
  } else {
    snackbar.open('You have unsaved changes.', 'DISCARD');
    return false;
  }
};
