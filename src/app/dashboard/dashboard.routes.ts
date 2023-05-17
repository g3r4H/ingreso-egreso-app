import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticaComponent } from '../ingreso-egreso/estadistica/estadistica.component';
import { IngresoEgresoComponent } from '../ingreso-egreso/ingreso-egreso.component';
import { DetalleComponent } from '../ingreso-egreso/detalle/detalle.component';

export const DashboardRoutes: Routes = [
  { path: 'detalle', component: DetalleComponent },
  { path: 'ingreso-egreso', component: IngresoEgresoComponent },
  { path: '', component: EstadisticaComponent },
];
