import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { getCategoryResponse } from '../../interfaces/categorias';
import { CartItem, GetProductResponse, ReturnProductRequest } from '../../interfaces/produc';
import { CategoriaServicios } from '../../servicios/categoria-servicios';

import { ProductoServicios } from '../../servicios/producto-servicios';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarritoServicios } from '../../servicios/carrito-servicios';
import { ProductCardComponent } from '../../components/product-card/product-card.component';


@Component({
  imports: [MatIconModule, MatListModule, ProductCardComponent],
  selector: 'app-produ-list-page',
  styleUrl: './produ-list-page.scss',
  templateUrl: './produ-list-page.html',
})
export class ProduListPage {

  protected categories = signal<getCategoryResponse[]>([])
  protected products = signal<GetProductResponse[]>([])

  private categoryService = inject(CategoriaServicios)
  private productService = inject(ProductoServicios)
  private cartService = inject(CarritoServicios)
  private _snackBar = inject(MatSnackBar)

  protected categorySelected = signal<string>('0')

  constructor() {
    this.categoryService.getAll().subscribe({
      next: resp => this.categories.set(resp.categories),   
      error: (e) => console.log(e.error)
    })

    effect(() => {
      const req: ReturnProductRequest =
      {
        categoryId: this.categorySelected()
      }
      this.productService.getAll(req).subscribe({
        next: resp => this.products.set(resp.products),  
        error: (e) => console.log(e.error)
      })
    })

  }

  protected onAddToCart(product: GetProductResponse): void {

    const item: CartItem = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    }

    this.cartService.addToCart(item)
    this._snackBar.open('Agregado al carrito!', 'ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1000
    })
  }
}
