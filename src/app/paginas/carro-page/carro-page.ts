import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { OrdenServicios } from '../../servicios/orden-servicios';
import { CarritoServicios } from '../../servicios/carrito-servicios';
import { CreateOrderRequest } from '../../interfaces/ordenes';

import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterLink,
    DecimalPipe
  ],
  selector: 'app-carro-page',
  styleUrl: './carro-page.scss',
  templateUrl: './carro-page.html',
})
export class CarroPage {

  protected cartService = inject(CarritoServicios);
  private orderService = inject(OrdenServicios);

  protected total = computed(() =>
    this.cartService.getItems().reduce(
      (total, item) => total + (item.price * item.quantity), 0
    )
  );

  protected subtotal = computed(() => this.total() / 1.18);

  protected taxes = computed(() => this.total() - this.subtotal());

  protected increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  protected decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  protected removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  protected finishPurchase(): void {
    const req: CreateOrderRequest = {
      totalAmount: this.total(),
      details: this.cartService.getItems()
        .map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price
        }))
    };

    this.orderService.create(req).subscribe({
      next: resp => {
        Swal.fire({
          title: "Compra Realizada",
          text: `Nro de orden: ${resp}`,
          icon: "success"
        });

        this.cartService.cleanItem()
      },
      error: (e) => console.log(e.error)
    });
  }
}

