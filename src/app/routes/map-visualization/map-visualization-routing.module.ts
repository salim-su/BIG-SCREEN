import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapVisualizationMainComponent } from './map-visualization-main/map-visualization-main.component';

const routes: Routes = [
  {
    path: 'map-visualization-main',
    component: MapVisualizationMainComponent,
    data: { title: '地图', titleI18n: '地图' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapVisualizationRoutingModule {}
