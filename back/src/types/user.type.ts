export interface CurrentUserDTO {
  id: string; 
  role: string 
}

export interface TransactionQuery {
  search?: string;
  categoryId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}