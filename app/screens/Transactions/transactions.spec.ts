import { describe, it, expect, vi } from 'vitest';
import { ref, computed } from 'vue';
import { mount } from '@vue/test-utils';
import Transactions from './index.vue';

const mockTransactions = [
  {
    avatar: '/images/avatars/emma-richardson.jpg',
    name: 'Emma Richardson',
    category: 'General',
    date: '2024-08-19T14:23:11Z',
    amount: 75.5,
    recurring: false,
  },
  {
    avatar: '/images/avatars/savory-bites-bistro.jpg',
    name: 'Savory Bites Bistro',
    category: 'Dining Out',
    date: '2024-08-19T20:23:11Z',
    amount: -55.5,
    recurring: false,
  },
  {
    avatar: '/images/avatars/daniel-carter.jpg',
    name: 'Daniel Carter',
    category: 'General',
    date: '2024-08-18T09:45:32Z',
    amount: -42.3,
    recurring: false,
  },
  {
    avatar: '/images/avatars/sun-park.jpg',
    name: 'Sun Park',
    category: 'General',
    date: '2024-08-17T16:12:05Z',
    amount: 120.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/urban-services-hub.jpg',
    name: 'Urban Services Hub',
    category: 'General',
    date: '2024-08-17T21:08:09Z',
    amount: -65.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/liam-hughes.jpg',
    name: 'Liam Hughes',
    category: 'Groceries',
    date: '2024-08-15T18:20:33Z',
    amount: 65.75,
    recurring: false,
  },
  {
    avatar: '/images/avatars/lily-ramirez.jpg',
    name: 'Lily Ramirez',
    category: 'General',
    date: '2024-08-14T13:05:27Z',
    amount: 50.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/ethan-clark.jpg',
    name: 'Ethan Clark',
    category: 'Dining Out',
    date: '2024-08-13T20:15:59Z',
    amount: -32.5,
    recurring: false,
  },
  {
    avatar: '/images/avatars/james-thompson.jpg',
    name: 'James Thompson',
    category: 'Entertainment',
    date: '2024-08-11T15:45:38Z',
    amount: -5.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/pixel-playground.jpg',
    name: 'Pixel Playground',
    category: 'Entertainment',
    date: '2024-08-11T18:45:38Z',
    amount: -10.0,
    recurring: true,
  },
  {
    avatar: '/images/avatars/ella-phillips.jpg',
    name: 'Ella Phillips',
    category: 'Dining Out',
    date: '2024-08-10T19:22:51Z',
    amount: -45.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/sofia-peterson.jpg',
    name: 'Sofia Peterson',
    category: 'Transportation',
    date: '2024-08-08T08:55:17Z',
    amount: -15.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/mason-martinez.jpg',
    name: 'Mason Martinez',
    category: 'Lifestyle',
    date: '2024-08-07T17:40:29Z',
    amount: -35.25,
    recurring: false,
  },
  {
    avatar: '/images/avatars/green-plate-eatery.jpg',
    name: 'Green Plate Eatery',
    category: 'Groceries',
    date: '2024-08-06T08:25:44Z',
    amount: -78.5,
    recurring: false,
  },
  {
    avatar: '/images/avatars/sebastian-cook.jpg',
    name: 'Sebastian Cook',
    category: 'Transportation',
    date: '2024-08-06T10:05:44Z',
    amount: -22.5,
    recurring: false,
  },
  {
    avatar: '/images/avatars/william-harris.jpg',
    name: 'William Harris',
    category: 'Personal Care',
    date: '2024-08-05T14:30:56Z',
    amount: -10.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/elevate-education.jpg',
    name: 'Elevate Education',
    category: 'Education',
    date: '2024-08-04T11:15:22Z',
    amount: -50.0,
    recurring: true,
  },
  {
    avatar: '/images/avatars/serenity-spa-and-wellness.jpg',
    name: 'Serenity Spa & Wellness',
    category: 'Personal Care',
    date: '2024-08-03T14:00:37Z',
    amount: -30.0,
    recurring: true,
  },
  {
    avatar: '/images/avatars/spark-electric-solutions.jpg',
    name: 'Spark Electric Solutions',
    category: 'Bills',
    date: '2024-08-02T09:25:11Z',
    amount: -100.0,
    recurring: true,
  },
  {
    avatar: '/images/avatars/rina-sato.jpg',
    name: 'Rina Sato',
    category: 'Bills',
    date: '2024-08-02T13:31:11Z',
    amount: -50.0,
    recurring: false,
  },
  {
    avatar: '/images/avatars/swift-ride-share.jpg',
    name: 'Swift Ride Share',
    category: 'Transportation',
    date: '2024-08-01T18:40:33Z',
    amount: -18.75,
    recurring: false,
  },
  {
    avatar: '/images/avatars/aqua-flow-utilities.jpg',
    name: 'Aqua Flow Utilities',
    category: 'Bills',
    date: '2024-07-30T13:20:14Z',
    amount: -100.0,
    recurring: true,
  },
  {
    avatar: '/images/avatars/ecofuel-energy.jpg',
    name: 'EcoFuel Energy',
    category: 'Bills',
    date: '2024-07-29T11:55:29Z',
    amount: -35.0,
    recurring: true,
  },
  {
    avatar: '/images/avatars/yuna-kim.jpg',
    name: 'Yuna Kim',
    category: 'Dining Out',
    date: '2024-07-29T13:51:29Z',
    amount: -28.5,
    recurring: false,
  },
  {
    avatar: '/images/avatars/flavor-fiesta.jpg',
    name: 'Flavor Fiesta',
    category: 'Dining Out',
    date: '2024-07-27T20:15:06Z',
    amount: -42.75,
    recurring: false,
  },
  {
    avatar: '/images/avatars/harper-edwards.jpg',
    name: 'Harper Edwards',
    category: 'Shopping',
    date: '2024-07-26T09:43:23Z',
    amount: -89.99,
    recurring: false,
  },
];

vi.mock('./useTransactions', () => {
  const search = ref('');
  const selectedSort = ref('Oldest');
  const selectedCategory = ref('All Transactions');
  const currentPage = ref(1);
  const totalPages = ref(3);

  const paginatedTransactions = computed(() => {
    const perPage = 10;
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    let list = [...mockTransactions];

    if (selectedSort.value === 'Latest') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    else if (selectedSort.value === 'Oldest') {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    if (search.value) {
      list = list.filter(tx => tx.name.toLowerCase().includes(search.value.toLowerCase()));
    }

    if (selectedCategory.value !== 'All Transactions') {
      list = list.filter(tx => tx.category === selectedCategory.value);
    }

    return list.slice(start, end);
  });

  return {
    useTransactions: () => ({
      currentPage,
      totalPages,
      search,
      selectedSort,
      selectedCategory,
      paginatedTransactions,
      goToPage: (page: number) => {
        currentPage.value = page;
      },
    }),
  };
});

describe('Transactions Integration', () => {
  let transactionsComponent: ReturnType<typeof mount>;

  beforeEach(() => {
    transactionsComponent = mount(Transactions);
  });

  const getFirstRowText = () => {
    const firstRow = transactionsComponent.find('tbody tr');
    if (!firstRow.exists()) {
      return '';
    }
    return firstRow.findAll('td').map(td => td.text()).join(' ');
  };

  it('should render initial transactions sorted by Oldest', () => {
    expect(getFirstRowText()).toContain('Harper Edwards');
  });

  it('should filter transactions by search input', async () => {
    const searchInput = transactionsComponent.find('input[name="search"]');
    await searchInput.setValue('Savory');
    await transactionsComponent.vm.$nextTick();

    expect(getFirstRowText()).toContain('Savory Bites Bistro');
    expect(getFirstRowText()).not.toContain('Emma Richardson');
  });

  it('should change sorting to Latest and update the table', async () => {
    const sortDropdown = transactionsComponent.find('[data-testid="dropdown-sort-by"]');
    await sortDropdown.trigger('click');
    await transactionsComponent.vm.$nextTick();

    const options = transactionsComponent.findAll('li');
    const latestOption = options.find(opt => opt.text() === 'Latest');
    expect(latestOption).toBeTruthy();

    await latestOption!.trigger('click');
    await transactionsComponent.vm.$nextTick();

    expect(getFirstRowText()).toContain('Savory Bites Bistro');
  });

  it('should filter transactions by category', async () => {
    const categoryDropdown = transactionsComponent.find('[data-testid="dropdown-category"]');
    await categoryDropdown.trigger('click');
    await transactionsComponent.vm.$nextTick();

    const options = transactionsComponent.findAll('li');
    const generalOption = options.find(opt => opt.text() === 'Dining Out');
    expect(generalOption).toBeTruthy();

    await generalOption!.trigger('click');
    await transactionsComponent.vm.$nextTick();

    expect(getFirstRowText()).toContain('Savory Bites Bistro');
    expect(getFirstRowText()).not.toContain('Emma Richardson');
  });

  it('should paginate transactions and update table on page change', async () => {
    const transactionsComponent = mount(Transactions);

    const getFirstRowText = () => {
      const firstRow = transactionsComponent.find('tbody tr');
      if (!firstRow.exists()) {
        return '';
      }
      return firstRow.findAll('td').map(td => td.text()).join(' ');
    };

    expect(getFirstRowText()).toContain('Savory Bites Bistro');

    const pagination = transactionsComponent.find('[data-testid="pagination"]');
    expect(pagination.exists()).toBe(true);

    const buttons = pagination.findAll('button');
    const page2Button = buttons.find(btn => btn.text() === '2');
    expect(page2Button).toBeTruthy();

    await page2Button!.trigger('click');
    await transactionsComponent.vm.$nextTick();

    expect(getFirstRowText()).not.toContain('Savory Bites Bistro');
  });
});
