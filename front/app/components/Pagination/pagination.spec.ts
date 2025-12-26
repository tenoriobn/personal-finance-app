import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Pagination from './index.vue';

const mountComponent = (props = {}) =>
  mount(Pagination, {
    props: {
      currentPage: 2,
      totalPages: 5,
      ...props,
    },
  });

describe('Pagination', () => {
  it('Should render pagination container', () => {
    const wrapper = mountComponent();

    const pagination = wrapper.get('[data-testid="pagination"]');
    expect(pagination.element).toBeTruthy();
  });

  it('Should render page buttons', () => {
    const wrapper = mountComponent();

    const pageButtons = wrapper.findAll('button').filter(
      button => button.text().trim() !== '',
    );

    expect(pageButtons.length).toBeGreaterThan(0);
  });

  it('Should emit page-change when clicking a page button', async () => {
    const wrapper = mountComponent();

    const pageButton = wrapper
      .findAll('button')
      .find(button => button.text() === '3');

    expect(pageButton).toBeTruthy();

    await pageButton!.trigger('click');

    const emitted = wrapper.emitted('page-change');

    expect(emitted).toBeTruthy();

    const firstEmission = emitted && emitted[0] && emitted[0][0];
    expect(firstEmission).toBe(3);
  });

  it('Should visually disable previous button on first page', () => {
    const wrapper = mountComponent({ currentPage: 1 });

    const prevButton = wrapper.get('[data-testid="prev-pagination"]');

    expect(prevButton.classes()).toContain('cursor-not-allowed');
  });

  it('Should disable next button on last page', () => {
    const wrapper = mountComponent({
      currentPage: 5,
      totalPages: 5,
    });

    const nextButton = wrapper.get('[data-testid="next-pagination"]');

    expect(nextButton.attributes('disabled')).toBeDefined();
  });

  it('Should emit page-change when clicking next button', async () => {
    const wrapper = mountComponent({ currentPage: 2 });

    const nextButton = wrapper.get('[data-testid="next-pagination"]');

    await nextButton.trigger('click');

    const emitted = wrapper.emitted('page-change');

    expect(emitted).toBeTruthy();

    const firstEmission = emitted && emitted[0] && emitted[0][0];
    expect(firstEmission).toBe(3);
  });

  it('Should emit page-change when clicking previous button', async () => {
    const wrapper = mountComponent({ currentPage: 3 });

    const prevButton = wrapper.get('[data-testid="prev-pagination"]');

    await prevButton.trigger('click');

    const emitted = wrapper.emitted('page-change');

    expect(emitted).toBeTruthy();

    const firstEmission = emitted && emitted[0] && emitted[0][0];
    expect(firstEmission).toBe(2);
  });
});
