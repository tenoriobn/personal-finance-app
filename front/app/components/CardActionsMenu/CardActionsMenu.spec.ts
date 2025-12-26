import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CardActionsMenu from './index.vue';

const mountComponent = (open = false) =>
  mount(CardActionsMenu, {
    props: {
      open,
      editLabel: 'Edit',
      deleteLabel: 'Delete',
    },
    attachTo: document.body,
  });

describe('CardActionsMenu', () => {
  it('Should render the actions toggle button', () => {
    const wrapper = mountComponent();

    const toggleButton = wrapper.get('[data-testid="actions-toggle"]');
    expect(toggleButton.element).toBeTruthy();
  });

  it('Should not render the menu when open is false', () => {
    const wrapper = mountComponent(false);

    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  });

  it('Should render the menu when open is true', () => {
    const wrapper = mountComponent(true);

    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
  });

  it('Should emit "edit" event when edit action is clicked', async () => {
    const wrapper = mountComponent(true);

    await wrapper.get('[data-testid="edit-action"]').trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
  });

  it('Should emit "delete" event when delete action is clicked', async () => {
    const wrapper = mountComponent(true);

    await wrapper.get('[data-testid="delete-action"]').trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
  });

  it('Should close the menu after clicking an action', async () => {
    const onUpdateOpen = vi.fn();

    const wrapper = mount(CardActionsMenu, {
      props: {
        'open': true,
        'editLabel': 'Edit',
        'deleteLabel': 'Delete',
        'onUpdate:open': onUpdateOpen,
      },
    });

    await wrapper.get('[data-testid="edit-action"]').trigger('click');

    expect(onUpdateOpen).toHaveBeenCalledWith(false);
  });
});
