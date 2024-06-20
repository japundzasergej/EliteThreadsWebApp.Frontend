import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
};
export const passwordComplexityValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password: string = control.value;

  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return passwordRegex.test(password) ? null : { passwordComplexity: true };
};
