import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from './index.vue';

describe('Pagination', () => {
  it('should disable "prev" button when on the first page', () => {
    const paginationComponent = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const prevButton = paginationComponent.find('button');

    expect(prevButton.exists()).toBe(true);
    expect(prevButton.attributes('disabled')).toBeDefined();
  });

  it('should disable "next" button when on the last page', () => {
    const paginationComponent = mount(Pagination, {
      props: {
        currentPage: 5,
        totalPages: 5,
      },
    });

    const buttons = paginationComponent.findAll('button');
    const nextButton = buttons[buttons.length - 1];

    expect(nextButton!.exists()).toBe(true);
    expect(nextButton!.attributes('disabled')).toBeDefined();
  });

  it('Should issue "page change" to direct to page 3', async () => {
    const paginationComponent = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const buttons = paginationComponent.findAll('button');

    const twoButton = buttons.find(btn => btn.text() === '3');
    expect(twoButton).toBeTruthy();
    await twoButton!.trigger('click');

    expect(paginationComponent.emitted('page-change')).toBeTruthy();
    expect(paginationComponent.emitted('page-change')![0]).toEqual([3]);
  });
});
