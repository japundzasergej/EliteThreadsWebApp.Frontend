import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pagination } from '../types/pagination.types';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-order-paginator',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './order-paginator.component.html',
  styleUrl: './order-paginator.component.css',
})
export class OrderPaginatorComponent implements OnChanges {
  @Input() pagination!: Pagination;
  totalPages: number[] = [];

  isCurrentPage(pageNumber: number): boolean {
    const { pageIndex } = this.pagination;
    return pageNumber === pageIndex;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination']) {
      const { pageCount } = this.pagination;
      this.totalPages = Array.from({ length: pageCount! }, (_, i) => i + 1);
    }
  }
}
