import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export const imagesValidator = (min = 3, max = 5): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formArray = control as FormArray;
    const totalUploaded = formArray.length;
    if (totalUploaded < min || totalUploaded > max) {
      return {
        images: `The number of images must be between ${min} and ${max}`,
      };
    }
    return null;
  };
}
