import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  authState,
} from '@angular/fire/auth';
import { map, firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth: Auth = inject(Auth);
  #authState$ = authState(this.#auth);
  #userService = inject(UserService);
  #store = inject(Store<AppState>);
  #user: User | null = null;

  async setUser(userUid: string) {
    const user = await this.#userService.getUser(userUid);
    this.#store.dispatch(authActions.setUser({ user }));
  }

  unsetUser() {
    this.#user = null;
    this.#store.dispatch(authActions.unsetUser());
  }

  async createFirebaseUser(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.#auth, email, password).then(
      (fbUser) => {
        const newUser = new User(fbUser.user.uid, name, email);
        return this.#userService.create(
          newUser.uid,
          newUser.name,
          newUser.email
        );
      }
    );
  }

  async loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.#auth, email, password);
  }

  logout() {
    return this.#auth.signOut();
  }

  async isAuth() {
    const check = this.#authState$.pipe(map((fbUser) => fbUser != null));
    const isAuth = await firstValueFrom(check);
    return isAuth;
  }

  get user() {
    return { ...this.#user }; // Tip to prevent mutations
  }
}
