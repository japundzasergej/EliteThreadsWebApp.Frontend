import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseFormClass } from '../../helpers/base-form-class';

export class AdminForm extends BaseFormClass {
  override formGroup!: FormGroup;

  protected checkedItems(item: string | number, array: FormArray): boolean {
    return array.controls.some((control) => control.value === item);
  }

  protected updateItem(item: string | number, event: Event, array: FormArray) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      let index = array.controls.findIndex((x) => x.value == item);
      if (index === -1) {
        array.push(new FormControl(item));
      }
    } else {
      let index = array.controls.findIndex((x) => x.value == item);
      array.removeAt(index);
    }
  }
  protected collectErrors(
    groupName: string,
    controlName: string
  ): { [key: string]: boolean } {
    const group = this.formGroup.get(groupName) as FormGroup;
    const control = group.get(controlName) as FormControl;

    let errors: { [key: string]: any } = {};

    if (control && control.errors) {
      for (const errorType in control.errors) {
        switch (errorType) {
          case 'required':
            errors[errorType] = true;
            break;
          case 'minlength':
            errors['minlength'] = {
              currentLength: control.errors['minlength'].actualLength,
              requiredLength: control.errors['minlength'].requiredLength,
            };
            break;
          case 'maxlength':
            errors['maxLength'] = {
              currentLength: control.errors['maxlength'].actualLength,
              requiredLength: control.errors['maxlength'].requiredLength,
            };
            break;
          case 'min':
            errors['min'] = {
              currentValue: control.errors['min'].actual,
              requiredValue: control.errors['min'].min,
            };
            break;
          default:
            errors[errorType] = control.errors[errorType];
            break;
        }
      }
    }

    return errors;
  }
}
