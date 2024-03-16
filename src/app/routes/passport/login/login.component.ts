import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import MD5 from 'md5';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLoginComponent implements OnDestroy {
  showCaptcha = false;
  captchaUrl = '';
  captchaKey = '';
  seePassword = false;

  constructor(
    fb: FormBuilder,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(1)]],
      password: [null, Validators.required],
      remember: [true],
      captchaVerCode: [null, Validators.required]
    });
  }

  get captchaVerCode() {
    return this.form.controls['captchaVerCode'];
  }

  get userName() {
    return this.form.controls['userName'];
  }

  get password() {
    return this.form.controls['password'];
  }

  form: FormGroup;
  error = '';
  type = 0;

  count = 0;
  interval$: any;

  switch(ret: any) {
    this.type = ret.index;
  }

  submit() {
    this.error = '';
    this.captchaVerCode.markAsDirty();
    this.captchaVerCode.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    if (this.userName.invalid || this.password.invalid) {
      return;
    }

    this.http
      .post(
        'blade-auth/oauth/token?_allow_anonymous=true',
        {},
        {
          grant_type: 'password',
          username: this.userName.value,
          password: MD5(this.password.value),
          captchaKey: this.captchaKey,
          captchaVerCode: this.form.value.captchaVerCode ? this.form.value.captchaVerCode.toLowerCase() : '',
          tenantId: '000000'
        },
        {
          headers: {
            Authorization: 'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
            'Tenant-Id': '000000'
          }
        }
      )
      .subscribe((res: any) => {
        if (res.hasOwnProperty('error_code')) {
          this.msg.error(res.error_description);
          return;
        }
        // 设置用户Token信息
        const user = {
          token: res.access_token,
          refreshToken: res.refresh_token,
          name: res.nick_name,
          id: res.account
        };
        this.tokenService.set(user);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().subscribe(() => {
          let url = this.tokenService.referrer!.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  cl() {
    this.http.get('blade-auth/oauth/captcha?_allow_anonymous=true').subscribe(res => {
      this.captchaUrl = res.image;
      this.captchaKey = res.key;
    });
  }
}
