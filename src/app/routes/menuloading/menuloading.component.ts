import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu, MenuService, SettingsService } from '@delon/theme';

@Component({
  selector: 'app-menuloading',
  templateUrl: './menuloading.component.html',
  styles: []
})
export class MenuloadingComponent implements OnInit {
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    // this.router.navigateByUrl('dashboard');
    this.router.navigateByUrl('map-visualization/map-visualization-main');
    // const menuList: Menu[] = this.menuService.menus;
    // if (menuList[0].children!.length) {
    //   this.router.navigateByUrl(menuList[0].children![0]['path']);
    // } else {
    //   this.router.navigateByUrl(menuList[0]['path']);
    // }
  }
}
