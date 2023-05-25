import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'sortIngresoEgreso',
})
export class SortIngresoEgresoPipe implements PipeTransform {
  transform(value: IngresoEgreso[]): IngresoEgreso[] {
    console.log('pipe', value);

    // Why slice before sort?
    // https://mtsknn.fi/blog/js-read-only-array-sort/
    return value.slice().sort((a, b) => {
      if (a.type === 'Ingreso') {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
