import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthDictService {
  dictPackTypeInfo = {};
  dictPackTypeList = [];
  dictShippingOrderStatus = {};
  listShippingOrderStatus = [];
  tallyUserList = [];
  dictLocationInfo = {};
  dictLocationInfoList = [];
  dictCargoCategoryInfo = {};
  dictCargoCategoryList = [];
  dictMainLocationInfo = {};
  dictMainLocationInfoList = [];
  listHold = [];
  listShipType: [];
  listForecastStatus: [];
  dictClientCodeInfo = {};
  dictClientCodeList = [];
  dictCountryCodeInfo = {};
  dictCountryCodeList = [];
  dictTransportAreaInfo = {};
  dictTransportAreaList = [];
  dictCargoCategoryLv4List = [];
  listPlanType = [];
  listMachineType = [];
  listHandleType = [];

  constructor(private arraySrv: ArrayService, private httpClient: _HttpClient) {}

  list(params: any) {
    return this.httpClient.get('blade-system/dict/child-list', params).pipe(
      map(item => {
        // tslint:disable-next-line:no-shadowed-variable
        this.arraySrv.visitTree(item, item => {
          item.value = item.dictKey;
          item.label = item.dictValue;
          item.isLeaf = !item.children || item.children.length === 0;
        });
        return item;
      })
    );
  }

  parentList(params: any) {
    return this.httpClient.get('blade-system/dict/parent-list', params);
  }

  parentListBiz(params: any) {
    return this.httpClient.get('blade-system/dict-biz/parent-list', params);
  }

  childList(params: any) {
    return this.httpClient.get('blade-system/dict/child-list', params).pipe(
      map(item => {
        // tslint:disable-next-line:no-shadowed-variable
        this.arraySrv.visitTree(item, item => {
          item.key = item.id;
          item.isLeaf = item.children === undefined || item.children.length === 0;
        });
        return item;
      })
    );
  }

  childListBiz(params: any) {
    return this.httpClient.get('blade-system/dict-biz/child-list', params).pipe(
      map(item => {
        // tslint:disable-next-line:no-shadowed-variable
        this.arraySrv.visitTree(item, item => {
          item.key = item.id;
          item.isLeaf = item.children === undefined || item.children.length === 0;
        });
        return item;
      })
    );
  }

  submit(data: any) {
    return this.httpClient.post('blade-system/dict/submit', data);
  }

  submitBiz(data: any) {
    return this.httpClient.post('blade-system/dict-biz/submit', data);
  }

  remove(ids: string) {
    return this.httpClient.post(`blade-system/dict/remove?ids=${ids}`);
  }

  removeBiz(ids: string) {
    return this.httpClient.post(`blade-system/dict-biz/remove?ids=${ids}`);
  }

  changeIsSealed(ids: string, isSealed: any) {
    return this.httpClient.post(`blade-system/dict/changeIsSealed?ids=${ids}&isSealed=${isSealed}`);
  }

  changeIsSealedBiz(ids: string, isSealed: any) {
    return this.httpClient.post(`blade-system/dict-biz/changeIsSealed?ids=${ids}&isSealed=${isSealed}`);
  }

  dictionary(code: any) {
    return this.httpClient.get('blade-system/dict/dictionary', code);
  }

  // hold_position
  dictionaryBiz(code: any): any {
    return this.httpClient.get('blade-system/dict-biz/dictionary', code).pipe(
      map((item: any[]) => {
        item.sort((a, b) => {
          return a.sort - b.sort;
        });
        return item;
      })
    );
  }
}
