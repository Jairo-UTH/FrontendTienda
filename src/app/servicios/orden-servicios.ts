import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateOrderRequest, GetOrderListResponse } from '../interfaces/ordenes';

@Injectable({
  providedIn: 'root',
})
export class OrdenServicios {
  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/order`

  create(request: CreateOrderRequest): Observable<number> {
    return this.http.post<number>(`${this.endPoint}/create`, request)
  }

  getAll(): Observable<GetOrderListResponse> {
    return this.http.get<GetOrderListResponse>(`${this.endPoint}/getAll`)

    

  }
}
