import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnDestroy {
  ingresos = 0;
  egresos = 0;
  totalIngresos = 0;
  totalEgresos = 0;
  #itemsObs: Observable<IngresoEgreso[]>;
  #itemsSubs: Subscription;

  constructor(private store: Store<AppState>) {
    this.#itemsObs = this.store.select('ingresosEgresos', 'items');
    this.#itemsSubs = this.#itemsObs.subscribe((items) => {
      console.log('detalles items', items);
      this.generateStats(items);
    });
  }

  ngOnDestroy(): void {
    this.#itemsSubs.unsubscribe();
  }

  generateStats(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;

    for (const item of items) {
      if (item.type === 'Ingreso') {
        this.ingresos++;
        this.totalIngresos += item.amount;
      } else {
        this.egresos++;
        this.totalEgresos += item.amount;
      }
    }
  }
}
