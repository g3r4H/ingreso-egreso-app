import { Component, inject, OnDestroy } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User as MyUser } from '../app/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.authStateSubscription = this.authState$.subscribe(
      (fbUser: User | null) => {
        //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
        console.log('authState', fbUser);

        if (fbUser) {
          authService.setUser(fbUser.uid);
        } else {
          console.log('Call User unset');
          authService.unsetUser();
        }
      }
    );
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }
}
