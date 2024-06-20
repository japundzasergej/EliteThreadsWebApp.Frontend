import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { ModalService } from './services/modal-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContainerComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [],
})
export class AppComponent implements OnDestroy {
  private readonly modalService = inject(ModalService);
  title = 'EliteThreadsWebApp.Web';
  constructor() {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  }
  ngOnDestroy(): void {
    this.modalService.close();
  }
}
