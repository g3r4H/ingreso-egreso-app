import { Component, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnDestroy {
  #ingresoEgresoService = inject(IngresoEgresoService);
  ingresosEgresos: IngresoEgreso[] = [];
  #itemsObs: Observable<IngresoEgreso[]>;
  #itemsSubs: Subscription;

  constructor(private store: Store<AppState>) {
    this.#itemsObs = this.store.select('ingresosEgresos', 'items');
    this.#itemsSubs = this.#itemsObs.subscribe((items) => {
      console.log('detalles items', items);
      this.ingresosEgresos = items;
    });
  }

  delete(uid: string | undefined) {
    console.log(uid);
    if (uid) {
      this.#ingresoEgresoService.deleteOne(uid);
    }
  }

  ngOnDestroy(): void {
    this.#itemsSubs.unsubscribe();
  }
}
