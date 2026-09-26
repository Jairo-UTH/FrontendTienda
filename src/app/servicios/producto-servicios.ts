import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  CreateProductRequest,
  GetProductListResponse,
  ReturnProductRequest,
  UpdateProductRequest,
} from '../interfaces/produc';

@Service()
export class ProductoServicios {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/product`

  create(request: CreateProductRequest): Observable<number> {
    const formData = new FormData();
    formData.append('categoryId', request.categoryId.toString())
    formData.append('name', request.name)
    formData.append('price', request.price.toString())
    formData.append('stockQuantity', request.stockQuantity.toString())

    if (request.image) formData.append('image', request.image)

    return this.http.post<number>(`${this.endPoint}/create`, formData)
  }

  getAll(request: ReturnProductRequest): Observable<GetProductListResponse> {
    return this.http.get<GetProductListResponse>
      (`${this.endPoint}/getAll?categoryId=${request.categoryId}`)
  }

  update(request: UpdateProductRequest): Observable<void> {
    const formData = new FormData();
    formData.append('productId', request.productId.toString())
    formData.append('categoryId', request.categoryId.toString())
    formData.append('name', request.name)
    formData.append('price', request.price.toString())
    formData.append('stockQuantity', request.stockQuantity.toString())

    if (request.image) formData.append('image', request.image)

    return this.http.put<void>(this.endPoint, formData)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endPoint}/${id}`)
  }
}
