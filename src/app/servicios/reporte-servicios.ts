import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ReporteServicios {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/Reporte`

  getFactura(orderId: number): Observable<Blob> {
    return this.http.get(`${this.endPoint}/factura/${orderId}`, { responseType: 'blob' })
  }

  getReporteVentas(desde?: string, hasta?: string): Observable<Blob> {
    let params = new HttpParams()
    if (desde) params = params.set('desde', desde)
    if (hasta) params = params.set('hasta', hasta)
    return this.http.get(`${this.endPoint}/ventas`, { params, responseType: 'blob' })
  }

  getReporteMovimiento(productId: number): Observable<Blob> {
    const params = new HttpParams().set('productId', productId.toString())
    return this.http.get(`${this.endPoint}/movimientoProducto`, { params, responseType: 'blob' })
  }

  getReporteVentasPorDia(desde?: string, hasta?: string): Observable<Blob> {
    let params = new HttpParams()
    if (desde) params = params.set('desde', desde)
    if (hasta) params = params.set('hasta', hasta)
    return this.http.get(`${this.endPoint}/ventasPorDia`, { params, responseType: 'blob' })
  }
}
