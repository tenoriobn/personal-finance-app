import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Input from './index.vue';

describe('Input', () => {
  it('should render and change the input value', async () => {
    const inputComponent = mount(Input, {
      props: {
        modelValue: '',
        label: 'Pesquisar transações',
        name: 'search',
      },
    });

    const input = inputComponent.find('input[name="search"]');
    expect(input.exists()).toBe(true);

    await input.setValue('Savory');

    const emitted = inputComponent.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(['Savory']);
  });
});
