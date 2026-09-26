import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetEmployeeResponse } from '../Shared/Interface/get-employee-response';
import { GetEmployeeListResponse } from '../Shared/Interface/get-employee-response';
import { CreateEmployeeRequest } from '../Shared/Interface/create-employe-request';
import { UpdateEmployeeRequest } from '../Shared/Interface/update-employee-request';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/employee`

  getAll(): Observable<GetEmployeeListResponse> {
    return this.http.get<GetEmployeeListResponse>(this.endPoint);
  }

  getById(id: number): Observable<GetEmployeeResponse> {
    return this.http.get<GetEmployeeResponse>(`${this.endPoint}/${id}`);
  }
  create(request: CreateEmployeeRequest): Observable<void> {
    return this.http.post<void>(this.endPoint, request);
  }
  update(request: UpdateEmployeeRequest): Observable<void> {
    return this.http.put<void>(this.endPoint, request);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endPoint}/${id}`);
  }
}
