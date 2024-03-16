import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

// @ts-ignore
import { saveAs } from './FileSaver.js';

@Injectable({ providedIn: 'root' })
export class FileUtils {
  isload = false;
  constructor(private httpClient: _HttpClient) {}

  export(url: string, params: any): void {
    this.isload = true;
    this.httpClient
      .request('GET', url, {
        params,
        responseType: 'blob',
        observe: 'response'
      })
      .subscribe(res => {
        // @ts-ignore
        const fileName = res.headers.get('content-disposition').split(';')[1].split('filename=')[1];
        // @ts-ignore
        const blob = new Blob([res.body], { type: 'application/octet-stream' });
        saveAs(blob, decodeURI(fileName));
        this.isload = false;
      });
  }

  download(url: string, name: any): void {
    if (url.startsWith('./')) {
      url = url.substr(2, url.length);
    } else if (url.startsWith('/')) {
      url = url.substr(1, url.length);
    }
    url = location.origin + location.pathname + url;
    this.httpClient.request('GET', url, { responseType: 'blob', observe: 'response' }).subscribe(res => {
      // @ts-ignore
      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      saveAs(blob, decodeURI(name));
    });
  }
}
