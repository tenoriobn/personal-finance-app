import { describe, expect, it } from 'vitest';
import Table from './index.vue';
import { mount } from '@vue/test-utils';

describe.skip('<Table />', () => {
  it('should render the transactions array data formatted in the table', () => {
    // const transactions = [
    //   {
    //     avatar: '/images/avatars/emma-richardson.jpg',
    //     name: 'Emma Richardson',
    //     category: 'Em geral',
    //     date: '2024-08-19T14:23:11Z',
    //     amount: 75.5,
    //     recurring: false,
    //   },
    // ];

    // const tableComponent = mount(Table, {
    //   props: { transactions },
    // });

    // const cells = tableComponent.findAll('td').map(td => td.text());

    // expect(cells).toContain('Emma Richardson');
    // expect(cells).toContain('Em geral');
    // expect(cells).toContain('19/08/2024');
    // expect(cells).toContain('+R$\u00A075,50');
  });

  it('should render a message when the transactions array is empty', () => {
    const tableComponent = mount(Table, {
      // props: { transactions: [] },
    });

    const message = tableComponent.find('p');
    expect(message.exists()).toBe(true);
    expect(message.text()).toBe('No transactions found.');
  });
});
