import { FormGroup } from '@angular/forms';

export const mapValuesToFormGroup = (formGroup: FormGroup, data: any) => {
  Object.keys(formGroup.controls).forEach((group) => {
    if (formGroup.controls[group] instanceof FormGroup) {
      const groupControls = (formGroup.controls[group] as any).controls;
      Object.keys(groupControls).forEach((key) => {
        if (key === 'new' || key === 'mustHave') {
          groupControls[key].setValue(data[key] === true);
        } else if (
          key !== 'imageList' &&
          key !== 'size' &&
          key !== 'color' &&
          data[key] !== undefined
        ) {
          groupControls[key].setValue(data[key]);
        }
      });
    }
  });
};
