import { Component, inject, signal, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormField, form, required } from '@angular/forms/signals';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

import { getCategoryResponse } from '../../interfaces/categorias';
import { CategoriaServicios } from '../../servicios/categoria-servicios';
import { ProductoServicios } from '../../servicios/producto-servicios';
import { ImpuestoServicios } from '../../servicios/impuesto-servicios';   
import { GetImpuestoResponse } from '../../interfaces/impuesto';        
import {
  CreateProductRequest,
  GetProductResponse,
  ProductEditModel,
  UpdateProductRequest,
} from '../../interfaces/produc';

@Component({
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatSelectModule, FormField],
  selector: 'app-new-produ-page',
  styleUrl: './new-produ-page.scss',
  templateUrl: './new-produ-page.html',
})
export class NewProduPage {

  // ===== Crear producto =====
  private initialData = {
    categoryId: '0',
    name: '',
    price: '',
    stockQuantity: '',
    idImpuesto: '0',   
    image: null
  }

  private produtModel = signal(this.initialData);
  protected productForm = form(this.produtModel, (field) => {
    required(field.categoryId);
    required(field.name);
    required(field.price);
    required(field.stockQuantity);
    required(field.idImpuesto);  
  })

  protected selectedFile = signal<File | null>(null);
  protected categories = signal<getCategoryResponse[]>([])
  protected impuestos = signal<GetImpuestoResponse[]>([])   
  protected categoryService = inject(CategoriaServicios)
  protected productService = inject(ProductoServicios)
  protected impuestoService = inject(ImpuestoServicios)    
  private _snackBar = inject(MatSnackBar)
  private modalService = inject(NgbModal)

  constructor() {
    this.categoryService.getAll().subscribe({
      next: resp => this.categories.set(resp.categories),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
    this.impuestoService.getAll().subscribe({               
      next: resp => this.impuestos.set(resp.impuestos),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
    this.getProducts()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) this.selectedFile.set(input.files[0])
  }

  createProduct(): void {
    const { categoryId, name, price, stockQuantity, idImpuesto } = this.productForm().value()
    const req: CreateProductRequest = {
      categoryId: Number(categoryId),
      name,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      idImpuesto: Number(idImpuesto),  
    }
    if (this.selectedFile()) req.image = this.selectedFile()!

    this.productService.create(req).subscribe({
      next: () => {
        this._snackBar.open('Producto Añadido!', 'ok', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000
        })
        this.cleanForm()
        this.getProducts()
      },
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
  }

  cleanForm(): void {
    this.produtModel.set(this.initialData)
    this.productForm().reset()
    this.selectedFile.set(null)
  }

  // ===== Lista / editar / eliminar =====
  protected products = signal<GetProductResponse[]>([])
  private editSelectedFile = signal<File | null>(null)

  private editModel = signal<ProductEditModel>({
    productId: '0',
    categoryId: '0',
    name: '',
    price: '',
    stockQuantity: '',
    idImpuesto: '0',   
  })

  protected editForm = form(this.editModel, (field) => {
    required(field.categoryId);
    required(field.name);
    required(field.price);
    required(field.stockQuantity);
    required(field.idImpuesto); 
  })

  getProducts(): void {
    this.productService.getAll({ categoryId: '0' }).subscribe({
      next: resp => this.products.set(resp.products),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) this.editSelectedFile.set(input.files[0])
  }

  openModal(modalHtml: TemplateRef<any>, product: GetProductResponse): void {
    this.editSelectedFile.set(null)
    this.editModel.set({
      productId: product.productId.toString(),
      categoryId: product.categoryId,
      name: product.name,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      idImpuesto: product.idImpuesto.toString(),  
    })
    this.modalService.open(modalHtml, { size: 'lg' })
  }

  saveChanges(): void {
    const request: UpdateProductRequest = {
      productId: Number(this.editForm.productId().value()),
      categoryId: Number(this.editForm.categoryId().value()),
      name: this.editForm.name().value(),
      price: Number(this.editForm.price().value()),
      stockQuantity: Number(this.editForm.stockQuantity().value()),
      idImpuesto: Number(this.editForm.idImpuesto().value()), 
    }
    if (this.editSelectedFile()) request.image = this.editSelectedFile()!

    this.productService.update(request).subscribe({
      next: () => {
        Swal.fire({ text: 'Producto Editado!', icon: 'success' })
        this.modalService.dismissAll()
        this.getProducts()
      },
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Esta Seguro?',
      text: 'No podra revertir esta accion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Remuevelo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe({
          next: () => {
            Swal.fire({ text: 'Producto Removido!', icon: 'success' })
            this.getProducts()
          },
          error: (e: HttpErrorResponse) => {
            console.log(e.error)
            Swal.fire({ text: 'No se pudo eliminar (puede tener pedidos asociados)', icon: 'error' })
          }
        })
      }
    })
  }
}
