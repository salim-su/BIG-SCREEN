import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';

import { LayoutComponent } from '../layout/layoutNormal/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AbilityGuardService } from './exception/ability-guard.service';
import { MenuloadingComponent } from './menuloading/menuloading.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [SimpleGuard, AbilityGuardService],
    canActivateChild: [SimpleGuard, AbilityGuardService],
    children: [
      { path: '', redirectTo: 'menuloading', pathMatch: 'full' },
      {
        path: 'menuloading',
        component: MenuloadingComponent,
        data: { title: '加载', titleI18n: '加载' }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { preload: true }
      }
    ]
  },
  {
    path: 'map-visualization',
    loadChildren: () => import('./map-visualization/map-visualization.module').then(m => m.MapVisualizationModule)
  },
  {
    path: '',
    loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule),
    data: { preload: true }
  },
  {
    path: 'exception',
    loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)
  },
  { path: '**', redirectTo: 'exception/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class RouteRoutingModule {}
