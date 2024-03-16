import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { MenuService } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbilityGuardService implements CanActivate, CanActivateChild {
  private allowArray = ['/dashboard', '/menuloading', '/exception/403', '/exception/404', '/exception/500'];

  constructor(private menu: MenuService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._can(state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._can(state);
  }

  _can(state: RouterStateSnapshot): Observable<any> {
    return new Observable(x => {
      if (this.menu.getPathByUrl(state.url).length > 0) {
        x.next(true);
      } else if (this.allowArray.includes(state.url)) {
        x.next(true);
      } else {
        this.router.navigateByUrl('exception/403');
      }
    });
  }
}
