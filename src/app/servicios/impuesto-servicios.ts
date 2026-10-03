import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetImpuestoListResponse } from '../interfaces/impuesto';

@Injectable({ providedIn: 'root' })
export class ImpuestoServicios {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/impuesto`

  getAll(): Observable<GetImpuestoListResponse> {
    return this.http.get<GetImpuestoListResponse>(this.endPoint)
  }
}
