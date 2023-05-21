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
  onSnapshot,
  FirestoreDataConverter,
  getDoc,
} from '@angular/fire/firestore';
import { map, firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth: Auth = inject(Auth);
  #authState$ = authState(this.#auth);
  #firestore = inject(Firestore);
  #usersCollection: CollectionReference;
  #userConverter: FirestoreDataConverter<User>;

  constructor(private store: Store<AppState>) {
    this.#userConverter = {
      toFirestore: (user) => ({
        uid: user.uid,
        name: user.name,
        email: user.email,
      }),
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options) as User;
        return new User(data.uid, data.name, data.email);
      },
    };
    this.#usersCollection = collection(this.#firestore, 'users');
  }

  async setUser(userUid: string) {
    // Get a reference to the document we want to get. The converter here is just to guarentee correct data typing
    const docRef = doc(this.#usersCollection, userUid).withConverter(
      this.#userConverter
    );

    // Get the document with a promise
    const docSnap = await getDoc(docRef);
    console.log('docSnap', docSnap.data());

    // Or, subscribe to it
    /** 
        const unsub = onSnapshot(docRef, (res) => {
          console.log('res', res.data());
        });
        unsub() // --> Later, to stop listening
    */

    this.store.dispatch(authActions.setUser({ user: docSnap.data()! }));
  }

  unsetUser() {
    this.store.dispatch(authActions.unsetUser());
  }

  async createUser(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.#auth, email, password).then(
      (fbUser) => {
        const newUser = new User(fbUser.user.uid, name, email);
        return setDoc(doc(this.#usersCollection, fbUser.user.uid), <User>{
          ...newUser,
        });
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
}
