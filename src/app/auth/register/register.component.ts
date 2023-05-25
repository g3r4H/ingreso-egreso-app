import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as uiActions from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnDestroy {
  @ViewChild('errorSwal')
  public readonly errorSwal!: SwalComponent;

  #fb = inject(FormBuilder);
  #authService = inject(AuthService);
  #router = inject(Router);
  #store = inject(Store<AppState>);

  registroForm = this.#fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  uiSubs: Subscription;

  constructor() {
    this.uiSubs = this.#store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubs.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) {
      return;
    }

    this.#store.dispatch(uiActions.isLoading());

    const { nombre, correo, password } = this.registroForm.value;
    this.#authService
      .createFirebaseUser(nombre!, correo!, password!)
      .then(() => {
        this.#router.navigate(['/']);
      })
      .catch((error: FirebaseError) => {
        console.error('CATCH', error.message);
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      })
      .finally(() => {
        this.#store.dispatch(uiActions.stopLoading());
      });
  }
}
