import { AbstractControl, FormGroup } from '@angular/forms';
import { ImagesDTO } from '../types/image-dto.types';
import { Memoize } from 'typescript-memoize';

export class BaseFormClass {
  protected isUploading: boolean = false;
  protected progress: number = 0;
  protected formGroup!: FormGroup;
  private async convertToByteArray(file: File): Promise<string> {
    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const byteArray = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = byteArray.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(binary);
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
  protected async returnImage(event: Event) {
    const target = event.target as HTMLInputElement;
    let file: File | null = null;
    let dto = new ImagesDTO();
    if (target.files !== null) {
      file = target.files[0];
    }
    if (file !== null) {
      if (
        file.type !== 'image/jpg' &&
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png'
      ) {
        throw new Error();
      }

      dto.imageBytes = await this.convertToByteArray(file);
      dto.contentType = file.type;
    }
    this.isUploading = true;
    return dto;
  }

  @Memoize()
  protected getFormControls(input: string): { [key: string]: AbstractControl } {
    return (this.formGroup.get(input) as FormGroup).controls;
  }

  private getControl(key: string): AbstractControl {
    return this.formGroup.controls[key as keyof typeof this.formGroup.controls];
  }

  protected requiredError(key: string): string | undefined {
    const control: AbstractControl = this.getControl(key);
    if (control.errors?.['required'] && control.touched) {
      return 'This field is required.';
    }
    return undefined;
  }
}
