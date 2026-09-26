import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetPositionListResponse } from '../Shared/Interface/get-position-response';

@Injectable({
  providedIn: 'root',
})
export class PositionService {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/position`

  getAll(): Observable<GetPositionListResponse> {
    return this.http.get<GetPositionListResponse>(this.endPoint);
  }
}
