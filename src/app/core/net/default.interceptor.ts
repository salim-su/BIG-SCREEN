import { HttpErrorResponse, HttpEvent, HttpHandler, HttpParams, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { SettingsService } from '@delon/theme';

const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor {
  constructor(private injector: Injector, private msgSrv: NzMessageService, private settingsService: SettingsService) {}

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    // debugger;
    switch (ev.status) {
      case 200:
        if (ev instanceof HttpResponse) {
          const body: any = ev.body;
          if (body && body.hasOwnProperty('code')) {
            if (body.code === 401) {
              // alert(401);
              // (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
              // this.goTo('/passport/login');
              break;
            } else if (body.code !== 200) {
              this.msgSrv.warning(body.msg);
              // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
              // this.http.get('/').subscribe() 并不会触发
              return throwError({});
            } else {
              // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
              // @ts-ignore
              return of(new HttpResponse({ ...ev, body: body.data }));
            }
          } else {
            // 或者依然保持完整的格式
            return of(ev);
          }
        }
        break;
      case 400:
        if (ev instanceof HttpErrorResponse) {
          this.handleServiceError(ev);
        }
        break;
      case 401:
        // let url;
        // // 非同源
        // if (parent !== window) {
        //   url = document.referrer;
        // } else {
        //   url = parent.location.href;
        // }
        // parent.parent.window.location.href = 'http://10.10.21.252/platform2.0/#/passport/login';
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        this.goTo('/passport/login');
        return of(ev);
      case 403:
      case 404:
      case 500:
        // (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        // this.goTo('/passport/login');
        // window.location.reload();
        if (ev instanceof HttpErrorResponse) {
          this.handleServiceError(ev);
        }
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', ev);
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(ev);
    } else {
      return of(ev);
    }
  }

  handleServiceError(ev: HttpErrorResponse) {
    if (ev.error.error_description) {
      this.msgSrv.error(ev.error.error_description);
    } else {
      this.msgSrv.error(ev.error.msg);
    }
    return throwError({});
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }

    const cleanedParams = this.clearNullParams(req.params);
    const newReq = req.clone({
      headers: req.headers.append('areaId', this.settingsService.user['areaId'] ? this.settingsService.user['areaId'] : ''),
      url,
      params: cleanedParams
    });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) {
          return this.handleData(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => {
        return this.handleData(err);
      })
    );
  }

  clearNullParams(params: HttpParams): HttpParams {
    let cleanedParams = new HttpParams();
    params.keys().forEach(x => {
      // console.log(typeof params.get(x));
      // console.log(params.get(x) != null);
      if (params.get(x) !== undefined && params.get(x) != null && params.get(x) != 'null') {
        // @ts-ignore
        cleanedParams = cleanedParams.set(x, params.get(x));
      }
    });
    // debugger;
    return cleanedParams;
  }
}
