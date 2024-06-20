import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../services/local.service';
import { Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  private readonly localStorage = inject(LocalService);
  private readonly router = inject(Router);
  searchOpen$ = this.localStorage.watchSearch();

  close() {
    this.localStorage.saveSearch(`${this.searchOpen$}`);
  }

  searchProducts(value: string) {
    this.router.navigate(['/products'], {
      queryParams: {
        search: value,
      },
    });
  }
}
