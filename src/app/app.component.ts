import { Component, inject, OnDestroy } from '@angular/core';
import { Auth, authState, User as FBUser } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { IngresoEgresoService } from './services/ingreso-egreso.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  #auth = inject(Auth);
  #authService = inject(AuthService);
  #ingresoEgresoService = inject(IngresoEgresoService);
  authState$ = authState(this.#auth);
  authStateSubs: Subscription;

  constructor() {
    this.authStateSubs = this.authState$.subscribe((fbUser: FBUser | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      console.log('authState', fbUser);

      if (fbUser) {
        this.#authService.setUser(fbUser.uid);
      } else {
        console.log('Call User unset');
        this.#authService.unsetUser();
        this.#ingresoEgresoService.unsetItems();
      }
    });
  }

  ngOnDestroy() {
    this.authStateSubs.unsubscribe();
  }
}
