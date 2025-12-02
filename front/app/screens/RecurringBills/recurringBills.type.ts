export interface RecurringBill {
  id: string
  name: string
  date: string
  amount: number
  recurring?: boolean
  isPaid?: boolean
  isUpcoming?: boolean
  status: 'paid' | 'dueSoon' | 'upcoming'
}

export interface RecurringSummary {
  totalBills: number
  paidBills: number
  dueSoon: number
  upcoming: number
}

export interface RecurringBillsResponse {
  data: RecurringBill[]
  total: number
  page: number
  totalPages: number
  summary?: RecurringSummary
}
