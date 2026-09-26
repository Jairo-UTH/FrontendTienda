export interface CreateOrderRequest {
  totalAmount: number;
  details: CreateOrderDetailRequest[];
}

export interface CreateOrderDetailRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface GetOrderResponse {
  orderId: number;
  date: string;
  totalAmount: number;
  details: GetOrderDetailResponse[];
}

export interface GetOrderDetailResponse { 
  imageUrl: string,
  productName: string,
  quantity: number,
  total: number
}


export interface GetOrderListResponse {
  orders: GetOrderResponse[];
}
