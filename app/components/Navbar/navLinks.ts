import OverviewIcon from '~/assets/icons/icon-nav-overview.svg';
import TransactionsIcon from '~/assets/icons/icon-nav-transactions.svg';
import BudgetsIcon from '~/assets/icons/icon-nav-budgets.svg';
import PotsIcon from '~/assets/icons/icon-nav-pots.svg';
import RecurringBillsIcon from '~/assets/icons/icon-nav-recurring-bills.svg';

export const navLinks = [
  {
    to: '/',
    label: 'Overview',
    icon: OverviewIcon,
  },
  {
    to: '/transactions',
    label: 'Transactions',
    icon: TransactionsIcon,
  },
  {
    to: '/budgets',
    label: 'Budgets',
    icon: BudgetsIcon,
  },
  {
    to: '/pots',
    label: 'Pots',
    icon: PotsIcon,
  },
  {
    to: '/recurring-bills',
    label: 'Recurring Bills',
    icon: RecurringBillsIcon,
  },
];
