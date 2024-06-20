import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoResolveService {
  private readonly isEditable = true;

  pageIsEditable() {
    return this.isEditable;
  }
}
