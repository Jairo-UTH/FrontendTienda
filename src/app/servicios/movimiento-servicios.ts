import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateMovimientoRequest, GetMovimientoListResponse, GetResumenProductoResponse} from '../interfaces/movimiento';

@Injectable({ providedIn: 'root' })
export class MovimientoServicios {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/productoMovimiento`

  registrarCompra(request: CreateMovimientoRequest): Observable<number> {
    return this.http.post<number>(`${this.endPoint}/compra`, request)
  }

  getAll(): Observable<GetMovimientoListResponse> {
    return this.http.get<GetMovimientoListResponse>(`${this.endPoint}/getAll`)
  }

  getByProduct(productId: number): Observable<GetMovimientoListResponse> {
    return this.http.get<GetMovimientoListResponse>(`${this.endPoint}/byProduct/${productId}`)
  }

  getByEmployee(employeeId: number): Observable<GetMovimientoListResponse> {
    return this.http.get<GetMovimientoListResponse>(`${this.endPoint}/byEmployee/${employeeId}`)
  }

  getResumen(productId: number): Observable<GetResumenProductoResponse> {
    return this.http.get<GetResumenProductoResponse>(`${this.endPoint}/resumen/${productId}`)
  }
}
