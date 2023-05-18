import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  @ViewChild('errorSwal')
  public readonly errorSwal!: SwalComponent;

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  crearUsuario() {
    if (this.registroForm.invalid) {
      return;
    }
    const { nombre, correo, password } = this.registroForm.value;
    this.authService
      .createUser(nombre, correo, password)
      .then((credentials) => {
        console.log(credentials);
        this.router.navigate(['/']);
      })
      .catch((error: FirebaseError) => {
        console.error('CATCH', error.message);
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }
}
