import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { RouteRoutingModule } from './routes-routing.module';

const COMPONENTS: Array<Type<null>> = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, NzSwitchModule],
  declarations: [...COMPONENTS]
})
export class RoutesModule {}
