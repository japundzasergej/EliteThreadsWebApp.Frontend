import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserIdResolveService {
  private readonly userId: WritableSignal<string | undefined> =
    signal(undefined);
  setUserId(userId: string | undefined) {
    this.userId.set(userId);
  }
  getUserId() {
    return this.userId();
  }
}
