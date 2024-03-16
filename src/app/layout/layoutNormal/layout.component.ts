import {Component, Inject, isDevMode, OnInit} from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { MenuService } from '@delon/theme';
import { environment } from '@env/environment';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
  activatedMenuIndex = -1;
  menus: any;
  tabs: Array<{ path: string; title: string }> = [];
  btnFlag = false;
  constructor(
    private sysMenuService: MenuService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private reuseTabService: ReuseTabService,
    private menuService: MenuService
  ) {
    this.btnFlag = isDevMode();
  }

  logout(): void {
    this.menuService.clear();
    this.tokenService.clear();
    this.reuseTabService.clear();
    // this.router.navigateByUrl(this.tokenService.login_url!);
    this.router.navigateByUrl('');

    // console.log(this.reuseTabService.items);
    // console.log(this.reuseTabService.items);
  }

  activeMenu(menuPath: string | undefined, menuTitle: string): void {
    if (!menuPath) return;
    let menuIndex = -1;
    this.tabs.every((t, i) => {
      if (menuPath === t.path) {
        menuIndex = i;
        return false;
      }
      return true;
    });

    if (menuIndex === -1) {
      this.tabs.push({ path: menuPath, title: menuTitle });
      menuIndex = this.tabs.length - 1;
      this.activatedMenuIndex = menuIndex;
    }
  }

  activeRoute(path: string): void {
    this.router.navigateByUrl(path).finally();
  }

  toggleTab(path: string): void {
    this.activeRoute(path);
  }

  closeTab(path: string): void {
    if (1 === this.tabs.length) return;

    let selectedIndex = -1;
    this.tabs.every((t, i) => {
      if (t.path === path) {
        selectedIndex = i;
        return false;
      }

      return true;
    });
    this.tabs.splice(selectedIndex, 1);

    if (selectedIndex === this.activatedMenuIndex) {
      let prevIndex = this.activatedMenuIndex - 1;
      this.activatedMenuIndex = prevIndex > 0 ? prevIndex : 0;
      this.activeRoute(this.tabs[this.activatedMenuIndex].path);
    } else if (this.activatedMenuIndex > selectedIndex) {
      this.activatedMenuIndex -= 1;
    }
  }

  ngOnInit(): void {
    this.menus = this.sysMenuService['menus'];
  }
}
