import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Directive({
  selector: '[appHikVideo]'
})
export class HikVideoDirective implements AfterViewInit, OnDestroy {
  private ak = '';
  private sk = '';
  private proportion = 9 / 16;
  private hikPlayer = null;
  @Input()
  public hikResourceId = '';
  private domId;

  constructor(private el: ElementRef, private notificationService: NzNotificationService, private httpClient: HttpClient) {
    this.initContainer();
  }

  ngAfterViewInit(): void {
    if (!this.hikResourceId) {
      this.notificationService.info('提示', '没有视频资源ID');
      return;
    }
    this.initPlayer();
  }

  previewURL() {
    this.httpClient
      .get('common-serve/hik/previewURL247', {
        params: {
          cameraIndexCode: this.hikResourceId,
          streamType: '0'
        }
      })
      .subscribe(res => {
        this.play(res);
      });
  }

  /**
   * 容器
   */
  initContainer() {
    const dom = this.el.nativeElement as HTMLElement;
    this.domId = dom.id;

    const ww = window.innerWidth * 0.7;
    dom.style.width = `${ww}px`;
    dom.style.height = `${ww * this.proportion}px`;
    dom.style.background = 'red';

    // const ww = window.innerWidth * .85;
    // dom.style.width = ww + 'px';
    // dom.style.height = (ww * this.proportion) + 'px';
    // dom.style.background = 'red';
  }

  /**
   * 初始号播放器
   */
  initPlayer() {
    this.hikPlayer = new JSPlugin({
      szId: this.domId, // 需要英文字母开头 必填
      szBasePath: `${location.origin + location.pathname}./assets/js/hik_player/`, // 必填,引用H5player.min.js的js相对路径
      // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
      // iWidth: 600,
      // iHeight: 400,
      // 分屏播放，默认最大分屏4*4
      iMaxSplit: 1,
      iCurrentSplit: 1,
      // 样式
      oStyle: {
        border: '#343434',
        borderSelect: '#FFCC00',
        background: '#000'
      }
    });

    this.previewURL();
  }

  /**
   * 播放 视频
   *
   * @param url: string
   */
  play(url) {
    this.hikPlayer.JS_Play(url, {
      playURL: url, // 流媒体播放时必传
      mode: 1 // 解码类型：0=普通模式; 1=高级模式 默认为0
    });
  }

  ngOnDestroy(): void {
    this.hikPlayer.JS_Stop().then(
      () => {
        console.log('hikplayer stop');
      },
      e => {
        console.error(e);
      }
    );
  }
}
