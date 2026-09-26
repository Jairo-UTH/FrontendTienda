export interface getCategoryResponse {
  categoryId: string;
  icon: string;
  name: string;
}

export interface getCategoryListResponse {
  categories: getCategoryResponse[];
}
