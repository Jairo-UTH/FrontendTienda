import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormField, form, required } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';

import { MovimientoServicios } from '../../servicios/movimiento-servicios';
import { ProductoServicios } from '../../servicios/producto-servicios';
import { GetProductResponse } from '../../interfaces/produc';
import { GetMovimientoResponse, GetResumenProductoResponse } from '../../interfaces/movimiento';

@Component({
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormField],
  selector: 'app-movimientos-page',
  styleUrl: './movimientos-page.scss',
  templateUrl: './movimientos-page.html',
})
export class MovimientosPage {

  private movimientoService = inject(MovimientoServicios)
  private productService = inject(ProductoServicios)
  private _snackBar = inject(MatSnackBar)

  protected productos = signal<GetProductResponse[]>([])
  protected movimientos = signal<GetMovimientoResponse[]>([])

  private compraModel = signal({
    productId: '0',
    cantidad: '',
    precio: '',
    precioVenta: '',   
  })

  protected compraForm = form(this.compraModel, (field) => {
    required(field.productId);
    required(field.cantidad);
    required(field.precio);
  })

  protected resumenProductId = signal<string>('0')
  protected resumen = signal<GetResumenProductoResponse | null>(null)

  protected filtroProductId = signal<string>('0')
  protected filtroActivo = signal<boolean>(false)

  constructor() {
    this.productService.getAll({ categoryId: '0' }).subscribe({
      next: resp => this.productos.set(resp.products),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
    this.cargarMovimientos()
  }

  cargarMovimientos(): void {
    this.movimientoService.getAll().subscribe({
      next: resp => this.movimientos.set(resp.movimientos),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
  }

  onProductoSeleccionado(productId: number): void {
    const producto = this.productos().find(p => p.productId === productId)
    if (!producto) return

    this.compraModel.update(m => ({ ...m, precioVenta: producto.price.toString() }))
  }

  registrarCompra(): void {
    const { productId, cantidad, precio, precioVenta } = this.compraForm().value()

    this.movimientoService.registrarCompra({
      productId: Number(productId),
      tipoMovimiento: 'COMPRA',
      cantidad: Number(cantidad),
      precio: Number(precio),
      precioVenta: precioVenta ? Number(precioVenta) : undefined,   
    }).subscribe({
      next: () => {
        this._snackBar.open('Compra registrada, stock actualizado', 'ok', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000
        })
        this.limpiarFormulario()
        this.cargarMovimientos()
      },
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
  }

  consultarResumen(): void {
    const id = Number(this.resumenProductId())
    if (!id) return

    this.movimientoService.getResumen(id).subscribe({
      next: resp => this.resumen.set(resp),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })
  }

  filtrarPorProducto(): void {
    const id = Number(this.filtroProductId())
    if (!id) return

    this.movimientoService.getByProduct(id).subscribe({
      next: resp => {
        this.movimientos.set(resp.movimientos)
        this.filtroActivo.set(true)
      },
      error: (e: HttpErrorResponse) => console.log(e.error)
    })

    this.limpiarFormulario()
  }

  verTodosLosMovimientos(): void {
    this.filtroProductId.set('0')
    this.filtroActivo.set(false)
    this.cargarMovimientos()
  }

  private limpiarFormulario(): void {
    this.compraModel.set({ productId: '0', cantidad: '', precio: '', precioVenta: '' })
    this.compraForm().reset()
  }
}
