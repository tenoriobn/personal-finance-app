import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Modal from './index.vue';

const mountComponent = (modelValue = true) => {
  return mount(Modal, {
    props: {
      modelValue,
      'title': 'Modal Title',
      'intro': 'Modal intro text',
      'onUpdate:modelValue': vi.fn(),
    },
    attachTo: document.body,
  });
};

describe('Modal', () => {
  it('Should render modal when modelValue is true', () => {
    const wrapper = mountComponent(true);

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
  });

  it('Should not render modal when modelValue is false', () => {
    const wrapper = mountComponent(false);

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('Should render modal title and intro', () => {
    const wrapper = mountComponent(true);

    expect(wrapper.text()).toContain('Modal Title');
    expect(wrapper.text()).toContain('Modal intro text');
  });

  it('Should emit update:modelValue when clicking close button', async () => {
    const onUpdate = vi.fn();

    const wrapper = mount(Modal, {
      props: {
        'modelValue': true,
        'title': 'Modal Title',
        'onUpdate:modelValue': onUpdate,
      },
      attachTo: document.body,
    });

    const closeButton = wrapper.find('button[aria-label="Close modal"]');
    await closeButton.trigger('click');

    expect(onUpdate).toHaveBeenCalledWith(false);
  });

  it('Should close modal when clicking outside', async () => {
    const onUpdate = vi.fn();

    const wrapper = mount(Modal, {
      props: {
        'modelValue': true,
        'title': 'Modal Title',
        'onUpdate:modelValue': onUpdate,
      },
      attachTo: document.body,
    });

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(onUpdate).toHaveBeenCalledWith(false);
  });

  it('Should toggle body overflow when modal opens and closes', async () => {
    const wrapper = mountComponent(true);

    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    await wrapper.setProps({ modelValue: false });

    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });
});
