import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ToasterComponent } from '../toaster/toaster.component';
import { AuthService } from '@auth0/auth0-angular';
import { lastValueFrom, map, Observable, Subject, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    SpinnerComponent,
    ToasterComponent,
    AsyncPipe,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
})
export class ContainerComponent {
  isAdmin$ = inject(AuthService).idTokenClaims$.pipe(
    map((claims) => (claims?.['userRoles'] as string[])?.includes('Admin'))
  );
  isHomeOrProductRoute$ = inject(Router).events.pipe(
    map((event) => {
      if(event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        return url === '/' || url.startsWith('/product');
      }
      return false;
    })
  )
}
