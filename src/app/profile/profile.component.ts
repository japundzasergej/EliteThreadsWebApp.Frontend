import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SocialService } from '../services/social.service';
import { breakpoints } from '../types/breakpoints.types';
import { UpdatePasswordDTO, UserDTO } from '../types/social.types';
import { InfoComponent } from './info/info.component';
import { SettingsComponent } from './settings/settings.component';
import { ToasterService } from '../toaster/services/toaster.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgClass,
    InfoComponent,
    SettingsComponent,
    AsyncPipe,
    SearchBarComponent,
  ],
  providers: [SocialService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, AfterContentChecked {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly socialService = inject(SocialService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToasterService);
  private readonly param = inject(ActivatedRoute).paramMap.pipe(
    map((param) => param.get('userId'))
  );
  private readonly unsubscribe = new Subject<void>();
  private  userId!: string | null;
  isAuth0Provider = true;
  profile$!: Observable<UserDTO>;
  section: WritableSignal<string> = signal('info');
  isSelected = 'border rounded-full text-indigo-900';
  isTablet!: Observable<BreakpointState>;

  setSection(input: string) {
    this.section.set(input);
  }

  editUserInfo(dto: UserDTO) {
    this.socialService
      .updateUser(this.userId!, dto.toJSON())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Profile updated successfully!');
          window.location.reload();
        } else {
          throw new Error();
        }
      });
  }
  changeUserPassword(dto: UpdatePasswordDTO) {
    this.socialService
      .updateUserPassword(this.userId!, dto.toJSON())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Password changed.');
        } else {
          throw new Error();
        }
      });
  }

  deleteUser() {
    this.socialService
      .deleteUser(this.userId!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toast.showToastSuccess('Account deleted.');
          this.authService.logout();
        } else {
          throw new Error();
        }
      });
  }

  ngOnInit(): void {
    this.isTablet = this.breakpointObserver.observe([breakpoints.tablet]);
    this.profile$ = this.param.pipe(
      switchMap((param) => {
        this.userId = param;
        return this.socialService.getUser(param!);
      })
    );
  }
  ngAfterContentChecked(): void {
    this.param.subscribe((param) => {
      this.isAuth0Provider = param?.split('|')[0] === 'auth0';
    });
  }
}
