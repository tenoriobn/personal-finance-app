import type { RecurringBill } from '../recurringBills.type';

export interface RecurringBillsTableProps {
  recurringBills: RecurringBill[]
  pending: boolean
}
