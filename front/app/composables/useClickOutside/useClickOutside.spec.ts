import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useClickOutside } from './index';

describe('useClickOutside', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountWithComposable = (
    elementRefValue: HTMLElement | null,
    callback: () => void,
  ) => {
    return mount(
      defineComponent({
        setup() {
          const elementRef = ref<HTMLElement | null>(elementRefValue);
          useClickOutside(elementRef, callback);
          return {};
        },
        template: '<div />',
      }),
    );
  };

  it('Should register mousedown listener on mount', () => {
    const callback = vi.fn();

    mountWithComposable(document.createElement('div'), callback);

    expect(addEventListenerSpy).toHaveBeenCalledOnce();
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );
  });

  it('Should remove mousedown listener on unmount', () => {
    const callback = vi.fn();

    const wrapper = mountWithComposable(document.createElement('div'), callback);
    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );
  });

  it('Should call callback when clicking outside the referenced element', () => {
    const callback = vi.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    mountWithComposable(element, callback);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).toHaveBeenCalledOnce();

    document.body.removeChild(element);
  });

  it('Should not call callback when clicking inside the referenced element', () => {
    const callback = vi.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    mountWithComposable(element, callback);

    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('Should not call callback when element ref is null', () => {
    const callback = vi.fn();

    mountWithComposable(null, callback);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();
  });
});
