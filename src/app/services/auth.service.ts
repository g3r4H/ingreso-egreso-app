import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  authState,
} from '@angular/fire/auth';
import {
  CollectionReference,
  Firestore,
  setDoc,
  doc,
  collection,
} from '@angular/fire/firestore';
import { map, firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private authState$ = authState(this.auth);
  private firestore = inject(Firestore);
  //private users$: Observable<User[]>;
  private usersCollection: CollectionReference;

  constructor() {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async createUser(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (fbUser) => {
        const newUser = new User(fbUser.user.uid, name, email);
        return setDoc(doc(this.usersCollection, fbUser.user.uid), <User>{
          ...newUser,
        });
      }
    );
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async isAuth() {
    const check = this.authState$.pipe(map((fbUser) => fbUser != null));
    const isAuth = await firstValueFrom(check);
    return isAuth;
  }
}
