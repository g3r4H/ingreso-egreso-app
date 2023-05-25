import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  FirestoreDataConverter,
  collection,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #firestore = inject(Firestore);
  #store = inject(Store<AppState>);
  #collection: CollectionReference;
  #converter: FirestoreDataConverter<User>;

  constructor() {
    this.#converter = {
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
    this.#collection = collection(this.#firestore, 'users').withConverter(
      this.#converter
    );
  }

  async create(uid: string, name: string, email: string) {
    const newUser = new User(uid, name, email);
    return setDoc(doc(this.#collection, uid), <User>{
      ...newUser,
    });
  }

  async getUser(uid: string) {
    // Get a reference to the document we want to get. The converter here is just to guarentee correct data typing
    const docRef = doc(this.#collection, uid).withConverter(this.#converter);

    // Get the document with a promise
    const docSnap = await getDoc(docRef);

    // Or, subscribe to it
    /** 
        const unsub = onSnapshot(docRef, (res) => {
          console.log('res', res.data());
        });
        unsub() // --> Later, to stop listening
    */

    return docSnap.data()!;
  }
}
