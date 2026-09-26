import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { OrdenServicios } from '../../servicios/orden-servicios';
import { GetOrderResponse } from '../../interfaces/ordenes';

@Component({
  imports: [MatExpansionModule, MatIconModule, DecimalPipe],
  selector: 'app-compras-page',
  styleUrl: './compras-page.scss',
  templateUrl: './compras-page.html',
})
export class ComprasPage {

  private orderService = inject(OrdenServicios)
  protected orders = signal<GetOrderResponse[]>([])
  constructor() {
    this.orderService.getAll().subscribe(
      {
        next: resp => this.orders.set(resp.orders),  
        error: (e) => console.log(e.error)
      }
    )
  }

}
