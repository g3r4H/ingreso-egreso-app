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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnDestroy {
  @ViewChild('errorSwal')
  public readonly errorSwal!: SwalComponent;

  #fb = inject(FormBuilder);
  #authService = inject(AuthService);
  #router = inject(Router);
  #store = inject(Store<AppState>);

  loginForm: FormGroup;
  loginErrorMessage = '';
  loading = false;
  uiSubs: Subscription;

  constructor() {
    this.loginForm = this.#fb.group({
      correo: ['gera@email.com', [Validators.required, Validators.email]],
      password: ['qwerty', Validators.required],
    });

    this.uiSubs = this.#store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubs.unsubscribe();
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }

    this.#store.dispatch(uiActions.isLoading());

    const { correo, password } = this.loginForm.value;

    this.#authService
      .loginUser(correo, password)
      .then((credentials) => {
        console.log('SUCCESS', credentials);
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
