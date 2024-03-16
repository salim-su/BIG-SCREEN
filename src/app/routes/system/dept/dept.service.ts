import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeptService {
  constructor(private http: _HttpClient, private aryService: ArrayService) {}

  getCompanyTreeList(params: any) {
    return this.http.get('blade-system/dept/list', params).pipe(
      map(item => {
        this.aryService.visitTree(item, jtem => {
          jtem['title'] = jtem.deptName;
          jtem['key'] = jtem.id;
          jtem['isLeaf'] = !jtem.hasOwnProperty('children');
        });
        return item;
      })
    );
  }

  getUserDeptBiz(params: any): any {
    return this.http.get('blade-user/userDeptBiz/getUsersList', params);
  }

  submit(postData: any) {
    return this.http.post('blade-system/dept/submit', postData);
  }

  // orgCategory() {
  //     return this.http.get('blade-system/dict/dictionary', { code: environment.dict.orgCategory });
  // }

  remove(id: any) {
    return this.http.post('blade-system/dept/remove', {}, { ids: id });
  }
}
