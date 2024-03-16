import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { MapVisualizationMainComponent } from './map-visualization-main/map-visualization-main.component';
import { MapVisualizationRoutingModule } from './map-visualization-routing.module';

@NgModule({
  declarations: [MapVisualizationMainComponent],
  imports: [CommonModule, MapVisualizationRoutingModule, SharedModule]
})
export class MapVisualizationModule {}
