import { animate, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Memoize } from 'typescript-memoize';
import { LocalService } from '../services/local.service';
import { breakpoints } from '../types/breakpoints.types';
import {
  categories,
  subcategories,
  SubContent,
} from '../types/categories.types';
import { BannerComponent } from './banner/banner.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrl: 'navbar.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [animate('0.1s', style({ opacity: 0 }))]),
    ]),
  ],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    NgClass,
    BannerComponent,
    RouterLink,
    AsyncPipe,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly localStorage = inject(LocalService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly unsubscribe = new Subject<void>();
  @Input() isAdmin$!: Observable<boolean>;
  auth = inject(AuthService);
  searchOpen: boolean = false;
  isDesktop!: boolean;
  isMobile!: boolean;
  displayBanner!: boolean;
  isDesktopContent!: boolean;
  isMobileContent!: boolean;
  contentArray: WritableSignal<{ categoryName: string; sub: SubContent }> =
    signal({
      categoryName: '',
      sub: {
        subcategoryNames: [],
        images: [],
      },
    });
  categoriesList = categories;
  @ViewChild('snav') snav!: MatSidenav;

  toggle() {
    this.searchOpen = !this.searchOpen;
    this.localStorage.saveSearch(
      `${this.localStorage.getData('search') === 'true' ? 'false' : 'true'}`
    );
  }

  contentOn(categoryName: string, input: SubContent, isMobile: boolean) {
    if (isMobile) {
      this.isMobileContent = true;
    } else {
      this.isDesktopContent = true;
    }
    this.contentArray.set({
      categoryName,
      sub: input,
    });
  }
  contentOff(isMobile: boolean) {
    if (isMobile) {
      this.isMobileContent = false;
    } else {
      this.isDesktopContent = false;
    }
    this.contentArray.set({
      categoryName: '',
      sub: {
        subcategoryNames: [],
        images: [],
      },
    });
  }

  @Memoize()
  filterSubcategories(categoryName: string): SubContent {
    const subcategoryArray = subcategories.find(
      (sub) => sub.categoryName == categoryName
    );
    return {
      subcategoryNames: subcategoryArray?.subcategoryNames ?? [],
      images: subcategoryArray?.images ?? [],
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnInit(): void {
    this.localStorage.saveSearch(`${this.searchOpen}`);
    const xLarge = this.breakpointObserver.observe([breakpoints.widescreen]);
    const xSmall = this.breakpointObserver.observe([breakpoints.small]);

    combineLatest([xLarge, xSmall])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([xLargeResult, xSmallResult]) => {
        this.isDesktop = xLargeResult.matches;
        this.isMobile = xSmallResult.matches;
        if (xLargeResult.matches && this.snav !== undefined) {
          this.contentOff(true);
          this.snav.close();
        } else if (xSmallResult.matches) {
          this.contentOff(false);
        }
      });
  }
}
