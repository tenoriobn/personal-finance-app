export interface RecurringBillsQuery {
  search?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}

export interface RecurringBillDTO {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: "paid" | "dueSoon" | "upcoming";
}

export interface RecurringBillsSummary {
  totalBills: number;
  paidBills: number;
  dueSoon: number;
  upcoming: number;
}

export interface RecurringBillsResponse {
  data: RecurringBillDTO[];
  total: number;
  page: number;
  totalPages: number;
  summary: RecurringBillsSummary;
}
