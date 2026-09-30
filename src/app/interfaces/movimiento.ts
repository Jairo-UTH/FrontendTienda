export interface GetMovimientoResponse {
  idProductoMovimiento: number;
  productId: number;
  productName: string;
  tipoMovimiento: string;
  cantidad: number;
  precio: number;
  fechaMovimiento: string;
  employeeId: number | null;
  employeeName: string | null;
}

export interface GetMovimientoListResponse {
  movimientos: GetMovimientoResponse[];
}

export interface CreateMovimientoRequest {
  productId: number;
  tipoMovimiento: string;
  cantidad: number;
  precio: number;
  precioVenta?: number;  
}

export interface GetResumenProductoResponse {
  productId: number;
  productName: string;
  existencia: number;
  precioVenta: number;
  fechaUltimaCompra: string | null;
  ultimoPrecioCompra: number | null;
  fechaUltimaVenta: string | null;
}
