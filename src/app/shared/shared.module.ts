import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResizableModule } from 'ng-zorro-antd/resizable';

import { MapPanelDirective } from './map-panel/map-panel.directive';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { SafePipe } from './utils/safe.pipe';
import { HikVideoDirective } from './hik-video/hik-video.directive';
// #region third libs

const THIRDMODULES: Array<Type<void>> = [];

// #endregion

// #region your componets & directives

const COMPONENTS: Array<Type<void>> = [];
const DIRECTIVES: Array<Type<void>> = [MapPanelDirective, HikVideoDirective];

// #endregion

@NgModule({
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    NzDividerModule,
    NzIconModule,
    NzResizableModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    SafePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    NzDividerModule,
    NzIconModule,
    NzResizableModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    SafePipe
  ]
})
export class SharedModule {}
