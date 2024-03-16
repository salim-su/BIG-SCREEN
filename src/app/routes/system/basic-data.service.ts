import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Injectable({
  providedIn: 'root'
})
export class BasicDataService {
  constructor(private httpClient: _HttpClient) {}

  packageTypePage(params: any): any {
    return this.httpClient.get('tjpn4-transport/packageType/page', params);
  }

  packageTypeList(params: any): any {
    return this.httpClient.get('tjpn4-transport/packageType/list', params);
  }

  treeList(params: any): any {
    return this.httpClient.get('tjpn4-transport/cargoCategory/treeList', params);
  }

  cargoCategoryList(params: any): any {
    return this.httpClient.get('tjpn4-transport/cargoCategory/list', params);
  }

  enabledTreeList(params: any): any {
    return this.httpClient.get('tjpn4-transport/cargoCategory/enabledTreeList', params);
  }

  enabledMap(params: any): any {
    return this.httpClient.get('tjpn4-transport/cargoCategory/enabledMap', params);
  }

  selectedItemsMap(params: any): any {
    return this.httpClient.get('tjpn4-transport/categoryGroup/selectedItemsMap', params);
  }

  changeStatus(params: any): any {
    return this.httpClient.post(`tjpn4-transport/cargoCategory/changeStatus?id=${params}`);
  }

  cargoCategoryRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/cargoCategory/remove?id=${id}`);
  }

  packageTypeRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/packageType/remove?id=${id}`);
  }

  groupRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/categoryGroup/removeGroup?id=${id}`);
  }

  titleRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/categoryGroup/removeTitle?id=${id}`);
  }

  cargoCategorySubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/cargoCategory/submit', postData);
  }

  cargoCategorySimpleSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/cargoCategory/simpleSubmit', postData);
  }

  checkDangerCargo(params: any): any {
    return this.httpClient.get('tjpn4-transport/cargoCategory/checkDangerCargo', params);
  }

  getHuadongCode(params: any): any {
    return this.httpClient.get('tjpn4-transport/cargoCategory/getHuadongCode', params);
  }

  itemSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/categoryGroup/submitItem', postData);
  }

  packageTypeSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/packageType/submit', postData);
  }

  groupSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/categoryGroup/submitGroup', postData);
  }

  titleSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/categoryGroup/submitTitle', postData);
  }

  /*货名统计分类*/
  categoryGroupPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/categoryGroup/groupPage', params);
  }

  titlePage(params: any): any {
    return this.httpClient.get('tjpn4-transport/categoryGroup/titlePage', params);
  }

  itemPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/categoryGroup/itemPage', params);
  }

  clientCodePage(params: any): any {
    return this.httpClient.get('tjpn4-transport/clientCode/page', params);
  }

  clientCodeList(params: any): any {
    return this.httpClient.get('tjpn4-transport/clientCode/list', params);
  }
  jituanClientPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/clientCode/jituanClientPage', params);
  }

  getClientContact(params: any): any {
    return this.httpClient.get('tjpn4-transport/clientCode/getContactByCode', params);
  }

  clientCodeSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/clientCode/submit', postData);
  }

  clientCodeRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/clientCode/remove?id=${id}`);
  }

  countryCodePage(params: any): any {
    return this.httpClient.get('tjpn4-transport/countryCode/page', params);
  }

  countryCodeList(params: any): any {
    return this.httpClient.get('tjpn4-transport/countryCode/list', params);
  }

  countryCodeSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/countryCode/submit', postData);
  }

  countryCodeRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/countryCode/remove?id=${id}`);
  }

  dangerCargoPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/dangerCargo/page', params);
  }

  dangerCargoDetail(params: any): any {
    return this.httpClient.get('tjpn4-transport/dangerCargo/detail', params);
  }

  dangerCargoSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/dangerCargo/submit', postData);
  }

  dangerCargoRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/dangerCargo/remove?id=${id}`);
  }

  contactPersonSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/contactPerson/submitBatch', postData);
  }

  getContactPersonNameByPhone(params: any): any {
    return this.httpClient.get('tjpn4-transport/contactPerson/getNameByPhone', params);
  }

  contactPersonPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/contactPerson/page', params);
  }

  contactPersonSingleSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/contactPerson/submit', postData);
  }

  contactPersonRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/contactPerson/remove?id=${id}`);
  }

  removeClientContact(id: any): any {
    return this.httpClient.post(`tjpn4-transport/clientContact/remove?id=${id}`);
  }
  listContactByClientId(clientId) {
    return this.httpClient.get(`tjpn4-transport/clientContact/listContactByClientId?clientId=${clientId}`);
  }

  saveOrUpdateClientContact(postData: any): any {
    return this.httpClient.post('tjpn4-transport/clientContact/saveOrUpdateClientContact', postData);
  }

  trainModelList(params: any): any {
    return this.httpClient.get('tjpn4-transport/trainModel/list', params);
  }

  trainModelPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/trainModel/page', params);
  }

  trainModelSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/trainModel/submit', postData);
  }

  trainModelRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/trainModel/remove?id=${id}`);
  }

  lineList(params: any): any {
    return this.httpClient.get('tjpn4-transport/line/list', params);
  }

  linePage(params: any): any {
    return this.httpClient.get('tjpn4-transport/line/page', params);
  }

  lineSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/line/submit', postData);
  }

  lineRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/line/remove?id=${id}`);
  }

  destinationList(params: any): any {
    return this.httpClient.get('tjpn4-transport/destination/list', params);
  }

  destinationPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/destination/page', params);
  }

  destinationSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/destination/submit', postData);
  }

  destinationRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/destination/remove?id=${id}`);
  }

  trainSendCarCargoList(params: any): any {
    return this.httpClient.get('tjpn4-transport/trainSendCarCargo/list', params);
  }

  trainSendCarCargoPage(params: any): any {
    return this.httpClient.get('tjpn4-transport/trainSendCarCargo/page', params);
  }

  trainSendCarCargoSubmit(postData: any): any {
    return this.httpClient.post('tjpn4-transport/trainSendCarCargo/submit', postData);
  }

  trainSendCarCargoRemove(id: any): any {
    return this.httpClient.post(`tjpn4-transport/trainSendCarCargo/remove?id=${id}`);
  }
}
