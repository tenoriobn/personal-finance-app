import OverviewIcon from '~/assets/icons/icon-nav-overview.svg';
import TransactionsIcon from '~/assets/icons/icon-nav-transactions.svg';
import BudgetsIcon from '~/assets/icons/icon-nav-budgets.svg';
import PotsIcon from '~/assets/icons/icon-nav-pots.svg';
import RecurringBillsIcon from '~/assets/icons/icon-nav-recurring-bills.svg';

export const navLinks = [
  {
    to: '/',
    label: 'Visão Geral',
    icon: OverviewIcon,
  },
  {
    to: '/transacoes',
    label: 'Transações',
    icon: TransactionsIcon,
  },
  {
    to: '/orcamentos',
    label: 'Orçamentos',
    icon: BudgetsIcon,
  },
  {
    to: '/poupancas',
    label: 'Poupanças',
    icon: PotsIcon,
  },
  {
    to: '/contas-recorrentes',
    label: 'Recorrentes',
    icon: RecurringBillsIcon,
  },
];
