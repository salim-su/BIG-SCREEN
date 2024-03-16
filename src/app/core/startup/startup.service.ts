import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { environment } from '@env/environment';
import { NzIconService } from 'ng-zorro-antd/icon';
import { Observable, zip, of, catchError, map } from 'rxjs';
import { BasicDataService } from '../../routes/system/basic-data.service';
import { AuthDictService } from '../../routes/system/dict/service/dict.service';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  areaIds = '';

  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private router: Router,
    private arrayService: ArrayService,
    private dictService: AuthDictService,
    private basicDataService: BasicDataService
  ) {
    iconSrv.addIcon(...icons);
    iconSrv.fetchFromIconfont({
      scriptUrl: './assets/js/iconfont.js'
    });
  }

  load(): Observable<void> {
    return zip(
      this.httpClient.get('blade-user/info'),
      this.httpClient.get(`blade-system/menu/routes?subsystemId=${environment.subsystem.bulk.id}`)
    ).pipe(
      // @ts-ignore
      catchError(() => {
        this.tokenService.clear();
        this.router.navigateByUrl(this.tokenService.login_url!);
        return null;
      }),
      // // 接收其他拦截器后产生的异常消息
      // catchError(res => {
      // 	console.warn(`StartupService.load: Network request failed`, res);
      // 	setTimeout(() => this.router.navigateByUrl(`/exception/500`));
      // 	return [];
      // }),

      map(([info, router]: any[]) => {
        // let result = '1436123296476143617';
        this.settingService.setUser(info);
        // 应用信息：包括站点名、描述、年份
        // this.settingService.setApp(appData.app);
        // 用户信息：包括姓名、头像、邮箱地址
        // ACL：设置权限为全量
        this.aclService.setFull(true);
        // // 初始化菜单
        const menuData = this.convertToMenu(router);
        this.menuService.add(menuData);
        // // 设置页面标题的后缀
        this.titleService.default = '一张图';
        this.titleService.suffix = '一张图';
      })
    );
  }

  convertToMenu(data: any) {
    this.arrayService.visitTree(data, item => {
      item.text = item.name;
      item.link = item.path;
      item.isLeaf = !item.hasOwnProperty('children') || item.children.length === 0;
    });
    return data;
  }
}
