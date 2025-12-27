import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ProgressBar from './index.vue';

const mountComponent = (props = {}) => {
  return mount(ProgressBar, {
    props,
  });
};

describe('ProgressBar', () => {
  it('Should render the progress bar component', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
  });

  it('Should apply default styles when props are not provided', () => {
    const wrapper = mountComponent();

    const container = wrapper.find('.bg-beige-100');
    const bar = wrapper.find('[role="progressbar"]');

    expect(container.classes()).toContain('p-1');
    expect(bar.classes()).toContain('h-6');
  });

  it('Should apply custom container padding and bar height', () => {
    const wrapper = mountComponent({
      containerPadding: 'p-3',
      barHeight: 'h-2',
    });

    const container = wrapper.find('.bg-beige-100');
    const bar = wrapper.find('[role="progressbar"]');

    expect(container.classes()).toContain('p-3');
    expect(bar.classes()).toContain('h-2');
  });

  it('Should apply the correct transform based on percent', () => {
    const wrapper = mountComponent({ percent: 40 });

    const progress = wrapper.find('[data-max="100"] > div');

    expect(progress.attributes('style')).toContain(
      'translateX(-60%)',
    );
  });

  it('Should apply the provided background color', () => {
    const wrapper = mountComponent({ colorHex: 'rgb(255, 0, 0)' });

    const progress = wrapper.find('[data-max="100"] > div');

    expect(progress.attributes('style')).toContain(
      'background-color: rgb(255, 0, 0)',
    );
  });
});
