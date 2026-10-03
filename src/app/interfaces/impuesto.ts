export interface GetImpuestoResponse {
  idImpuesto: number;
  nombre: string;
  porcentaje: number;
}

export interface GetImpuestoListResponse {
  impuestos: GetImpuestoResponse[];
}
