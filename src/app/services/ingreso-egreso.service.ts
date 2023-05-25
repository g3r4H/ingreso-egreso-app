import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  FirestoreDataConverter,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService implements OnDestroy {
  #firestore = inject(Firestore);
  #collection: CollectionReference;
  #converter: FirestoreDataConverter<IngresoEgreso>;
  #getAllFromUserUnsubs!: Unsubscribe;

  constructor(private store: Store<AppState>) {
    this.#converter = {
      toFirestore: ({ userUid, description, amount, type }) => ({
        userUid,
        description,
        amount,
        type,
      }),
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options) as IngresoEgreso;
        return new IngresoEgreso(
          data.userUid,
          data.description,
          data.amount,
          data.type
        );
      },
    };
    this.#collection = collection(
      this.#firestore,
      'ingresos-egresos'
    ).withConverter(this.#converter);
  }

  ngOnDestroy(): void {
    this.#getAllFromUserUnsubs();
  }

  getAllFromUser(userUid: string) {
    const q = query(this.#collection, where('userUid', '==', userUid));
    this.#getAllFromUserUnsubs = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as IngresoEgreso;
      });
      console.log('items to dispatch', items);
      this.store.dispatch(actions.setItems({ items }));
    });
  }

  unsetItems() {
    this.store.dispatch(actions.unsetItems());
  }

  async createOne(
    description: string,
    amount: number,
    type: string,
    userUid: string
  ) {
    const newIngresoEgreso = new IngresoEgreso(
      userUid,
      description,
      amount,
      type
    );
    return addDoc(this.#collection, newIngresoEgreso);
  }

  async deleteOne(uid: string) {
    await deleteDoc(doc(this.#collection, uid));
    console.log('Doc Deleted');
  }
}
