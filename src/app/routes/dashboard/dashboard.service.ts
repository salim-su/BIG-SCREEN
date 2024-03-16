import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private httpClient: _HttpClient) {}

  subsystemList() {
    return this.httpClient.get('blade-system/subsystem/subsystemByUser');
  }
}
