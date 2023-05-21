import { Component, OnDestroy, ViewChild } from '@angular/core';
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

  loginForm: FormGroup;
  loginErrorMessage = '';
  loading = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      correo: ['gera@email.com', [Validators.required, Validators.email]],
      password: ['qwerty', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    const { correo, password } = this.loginForm.value;

    this.authService
      .loginUser(correo, password)
      .then((credentials) => {
        console.log('SUCCESS', credentials);
        this.router.navigate(['/']);
      })
      .catch((error: FirebaseError) => {
        console.error('CATCH', error.message);
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      })
      .finally(() => {
        this.store.dispatch(uiActions.stopLoading());
      });
  }
}
