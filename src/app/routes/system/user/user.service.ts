import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: _HttpClient, private aryService: ArrayService) {}

  getUserPage(params: any) {
    return this.http.get('blade-user/page', params);
  }
}
