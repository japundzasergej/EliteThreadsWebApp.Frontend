import { JsonPipe, KeyValuePipe, NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UpdatePasswordDTO } from '../../types/social.types';
import {
  passwordComplexityValidator,
  passwordMatchValidator,
} from './validators/password.validators';
import { BaseFormClass } from '../../helpers/base-form-class';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, JsonPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent extends BaseFormClass {
  @Input() isAuth0Provider!: boolean;
  @Output() userDeleted = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<UpdatePasswordDTO>();
  @ViewChildren('input') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  private readonly formOptions: AbstractControlOptions = {
    validators: passwordMatchValidator,
    updateOn: 'blur',
  };
  private readonly fb = inject(FormBuilder);
  override formGroup = this.fb.group(
    {
      password: [
        '',
        {
          validators: [Validators.required, passwordComplexityValidator],
        },
      ],
      confirmPassword: ['', Validators.required],
    },
    this.formOptions
  );

  cdr = inject(ChangeDetectorRef);

  showPassword(index: number) {
    const input = this.inputs.find(
      (input) => input.nativeElement.id === `input${index}`
    );
    if (input?.nativeElement.type === 'password') {
      input.nativeElement.type = 'text';
    } else if (input?.nativeElement.type === 'text') {
      input.nativeElement.type = 'password';
    }
  }

  handleSubmit() {
    const dto = new UpdatePasswordDTO();
    dto.init(this.formGroup.value);
    this.passwordChanged.emit(dto);
  }
  deleteUser() {
    this.userDeleted.emit();
  }
}
