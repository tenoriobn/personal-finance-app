import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { useCurrencyMask } from './index';

describe('useCurrencyMask', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('Should format initial value when provided', async () => {
      const { formattedAmount, amount } = useCurrencyMask(12.34);

      await nextTick();

      expect(amount.value).toBe(12.34);
      expect(formattedAmount.value).toBe('R$\u00A012,34');
    });

    it('Should initialize with empty formatted value when initial value is zero', async () => {
      const { formattedAmount, amount } = useCurrencyMask(0);

      await nextTick();

      expect(amount.value).toBe(0);
      expect(formattedAmount.value).toBe('');
    });
  });

  describe('onInput', () => {
    it('Should progressively format numeric input as currency', () => {
      const { onInput, formattedAmount, amount } = useCurrencyMask();

      onInput('1');
      expect(formattedAmount.value).toBe('R$\u00A00,01');
      expect(amount.value).toBe(0.01);

      onInput('12');
      expect(formattedAmount.value).toBe('R$\u00A00,12');
      expect(amount.value).toBe(0.12);

      onInput('123');
      expect(formattedAmount.value).toBe('R$\u00A01,23');
      expect(amount.value).toBe(1.23);

      onInput('1234');
      expect(formattedAmount.value).toBe('R$\u00A012,34');
      expect(amount.value).toBe(12.34);
    });

    it('Should ignore non-numeric characters', () => {
      const { onInput, formattedAmount, amount } = useCurrencyMask();

      onInput('abc1d2');

      expect(formattedAmount.value).toBe('R$\u00A00,12');
      expect(amount.value).toBe(0.12);
    });

    it('Should not update value when max digits is exceeded', () => {
      const { onInput, formattedAmount, amount } = useCurrencyMask();

      onInput('12345678901234');
      const lastFormatted = formattedAmount.value;
      const lastAmount = amount.value;

      onInput('123456789012345');

      expect(formattedAmount.value).toBe(lastFormatted);
      expect(amount.value).toBe(lastAmount);
    });
  });

  describe('onKeyDown', () => {
    it('Should prevent non-numeric and non-allowed keys', () => {
      const { onKeyDown } = useCurrencyMask();
      const event = new KeyboardEvent('keydown', { key: 'a' });

      const preventDefault = vi.spyOn(event, 'preventDefault');

      onKeyDown(event);

      expect(preventDefault).toHaveBeenCalledOnce();
    });

    it('Should allow numeric keys when below max digits', () => {
      const { onKeyDown } = useCurrencyMask();
      const event = new KeyboardEvent('keydown', { key: '1' });

      const preventDefault = vi.spyOn(event, 'preventDefault');

      onKeyDown(event);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('Should prevent numeric input when max digits is reached', () => {
      const { onInput, onKeyDown, formattedAmount } = useCurrencyMask();

      onInput('12345678901234');

      const event = new KeyboardEvent('keydown', { key: '9' });
      const preventDefault = vi.spyOn(event, 'preventDefault');

      onKeyDown(event);

      expect(formattedAmount.value.replace(/\D/g, '').length).toBe(14);
      expect(preventDefault).toHaveBeenCalledOnce();
    });
  });

  describe('onPaste', () => {
    it('Should paste and format numeric content as currency', () => {
      const { onPaste, formattedAmount, amount } = useCurrencyMask();

      const clipboardEvent = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: vi.fn().mockReturnValue('1234'),
        },
      } as unknown as ClipboardEvent;

      onPaste(clipboardEvent);

      expect(amount.value).toBe(12.34);
      expect(formattedAmount.value).toBe('R$\u00A012,34');
    });

    it('Should trim pasted value to max digits', () => {
      const { onPaste, formattedAmount } = useCurrencyMask();

      const clipboardEvent = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: vi.fn().mockReturnValue('12345678901234567890'),
        },
      } as unknown as ClipboardEvent;

      onPaste(clipboardEvent);

      expect(formattedAmount.value.replace(/\D/g, '').length).toBe(14);
    });
  });
});
