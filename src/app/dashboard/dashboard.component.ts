import { Component, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Observable, Subscription, filter, map } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnDestroy {
  #ingresoEgresoService = inject(IngresoEgresoService);
  #authObs: Observable<User | null>;
  #authSubs: Subscription;

  constructor(private store: Store<AppState>) {
    this.#authObs = this.store.select('auth', 'user');

    // Gracias al "filter", los datos llegan al "subscribe" solamente cuando NO son nulos
    this.#authSubs = this.#authObs
      .pipe(filter((user) => user != null))
      .subscribe((user) => {
        console.log('Auth User', user);
        if (user) {
          this.#ingresoEgresoService.getAllFromUser(user.uid);
        }
      });
  }

  ngOnDestroy(): void {
    this.#authSubs.unsubscribe();
  }
}
