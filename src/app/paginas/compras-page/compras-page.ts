import { DecimalPipe } from '@angular/common';
import { Component, inject, signal, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { OrdenServicios } from '../../servicios/orden-servicios';
import { ReporteServicios } from '../../servicios/reporte-servicios';
import { ProductoServicios } from '../../servicios/producto-servicios';
import { AuthServicios } from '../../servicios/auth-servicios';
import { GetOrderResponse } from '../../interfaces/ordenes';
import { GetProductResponse } from '../../interfaces/produc';

@Component({
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, DecimalPipe, FormsModule],
  selector: 'app-compras-page',
  styleUrl: './compras-page.scss',
  templateUrl: './compras-page.html',
})
export class ComprasPage {

  private orderService = inject(OrdenServicios)
  private reporteService = inject(ReporteServicios)
  private productoService = inject(ProductoServicios)
  private modalService = inject(NgbModal)
  protected authService = inject(AuthServicios)

  protected orders = signal<GetOrderResponse[]>([])
  protected productos = signal<GetProductResponse[]>([])
  protected cargando = signal<string | null>(null)

  protected ventasDesde = ''
  protected ventasHasta = ''
  protected ventasPorDiaDesde = ''
  protected ventasPorDiaHasta = ''
  protected productoSeleccionado = ''

  constructor() {
    this.orderService.getAll().subscribe({
      next: resp => this.orders.set(resp.orders),
      error: (e: HttpErrorResponse) => console.log(e.error)
    })

    if (this.authService.isGerente()) {
      this.productoService.getAll({ categoryId: '0' }).subscribe({
        next: resp => this.productos.set(resp.products),
        error: (e: HttpErrorResponse) => console.log(e.error)
      })
    }
  }

  abrirModalVentas(modal: TemplateRef<any>): void {
    this.ventasDesde = ''
    this.ventasHasta = ''
    this.modalService.open(modal)
  }

  abrirModalMovimiento(modal: TemplateRef<any>): void {
    this.productoSeleccionado = ''
    this.modalService.open(modal)
  }

  abrirModalVentasPorDia(modal: TemplateRef<any>): void {
    this.ventasPorDiaDesde = ''
    this.ventasPorDiaHasta = ''
    this.modalService.open(modal)
  }

  generarVentas(): void {
    this.descargar('ventas', () => this.reporteService.getReporteVentas(this.ventasDesde, this.ventasHasta))
    this.modalService.dismissAll()
  }

  generarTodasLasVentas(): void {
    this.descargar('ventas', () => this.reporteService.getReporteVentas())
    this.modalService.dismissAll()
  }

  generarMovimiento(): void {
    if (!this.productoSeleccionado) return
    this.descargar('movimiento', () => this.reporteService.getReporteMovimiento(Number(this.productoSeleccionado)))
    this.modalService.dismissAll()
  }

  generarVentasPorDia(): void {
    this.descargar('ventasPorDia', () => this.reporteService.getReporteVentasPorDia(this.ventasPorDiaDesde, this.ventasPorDiaHasta))
    this.modalService.dismissAll()
  }

  private descargar(id: string, llamada: () => Observable<Blob>): void {
    this.cargando.set(id)
    llamada().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        this.cargando.set(null)
      },
      error: (e: HttpErrorResponse) => {
        console.log(e.error)
        this.cargando.set(null)
      }
    })
  }
}
