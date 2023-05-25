import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as uiActions from 'src/app/shared/ui.actions';
import { Subscription, firstValueFrom } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  #fb = inject(NonNullableFormBuilder);
  #store = inject(Store<AppState>);
  #ingresoEgresoService = inject(IngresoEgresoService);

  ingresoForm = this.#fb.group({
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });

  type = 'Ingreso';
  isAdding = false;
  #uiSubs!: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.#uiSubs = this.#store.select('ui').subscribe((ui) => {
      this.isAdding = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.#uiSubs.unsubscribe();
  }

  async save() {
    if (this.ingresoForm.invalid) {
      return;
    }

    this.#store.dispatch(uiActions.isLoading());

    const storeAuth = this.#store.select('auth', 'user');
    const user = await firstValueFrom<User>(storeAuth);
    const { description, amount } = this.ingresoForm.value;
    await this.#ingresoEgresoService.createOne(
      description!,
      amount!,
      this.type,
      user.uid
    );

    this.ingresoForm.reset();
    this.type = 'Ingreso';
    this.#store.dispatch(uiActions.stopLoading());
  }
}
