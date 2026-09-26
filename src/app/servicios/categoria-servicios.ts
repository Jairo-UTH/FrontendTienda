import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { getCategoryListResponse } from '../interfaces/categorias';

@Service()
export class CategoriaServicios {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/category`

  getAll(): Observable<getCategoryListResponse> {
    return this.http.get<getCategoryListResponse>(`${this.endPoint}/getAll`)
  }

}
