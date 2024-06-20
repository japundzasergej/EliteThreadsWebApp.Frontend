import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  private readonly sub = new Subject<String>();

  watchSearch() {
    return this.sub.asObservable();
  }

  getData(key: string) {
    return localStorage.getItem(key);
  }

  setData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  removeData(key: string) {
    localStorage.removeItem(key);
  }

  saveSearch(value: string) {
    localStorage.setItem('search', value);
    this.sub.next(value);
  }
}
