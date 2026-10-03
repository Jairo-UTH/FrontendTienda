export interface CreateProductRequest {
  categoryId: number;
  name: string;
  price: number;
  stockQuantity: number;
  idImpuesto: number;    
  image?: File;
}

export interface ReturnProductRequest {
  categoryId: string;
}

export interface GetProductResponse {
  productId: number;
  categoryId: string;
  categoryName: string;
  name: string;
  price: number;
  stockQuantity: number;
  idImpuesto: number;         
  impuestoNombre: string;      
  impuestoPorcentaje: number;  
  imageUrl: string;
}

export interface CartItem {
  productId: number,
  name: string,
  price: number,
  image: string,
  quantity: number
}


export interface UpdateProductRequest {
  productId: number;
  categoryId: number;
  name: string;
  price: number;
  stockQuantity: number;
  idImpuesto: number;    
  image?: File;
}

export interface ProductEditModel {
  productId: string;
  categoryId: string;
  name: string;
  price: string;
  stockQuantity: string;
  idImpuesto: string; 
}

export interface GetProductListResponse {
  products: GetProductResponse[];
}
