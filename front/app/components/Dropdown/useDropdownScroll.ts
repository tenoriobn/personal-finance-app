import { ref, watch, nextTick, type Ref } from 'vue';
import type { DropdownOption } from './dropdown.type';

const OPTION_HEIGHT_PX = 53;
const DEFAULT_VISIBLE_OFFSET = 2;

export function useDropdownScroll(
  dropdownListRef: Ref<HTMLElement | null>,
  isOpenRef: Ref<boolean>,
  optionsRef: Ref<(string | DropdownOption)[]>,
) {
  const canScrollUp = ref(false);
  const canScrollDown = ref(false);

  const getScrollableElement = () => dropdownListRef.value;

  const getMaxScrollTop = (el: HTMLElement) =>
    el.scrollHeight - el.clientHeight;

  const clampScrollTop = (value: number, max: number) =>
    Math.max(0, Math.min(value, max));

  const snapToOptionHeight = (scrollTop: number) =>
    Math.round(scrollTop / OPTION_HEIGHT_PX) * OPTION_HEIGHT_PX;

  const updateScrollIndicators = () => {
    const el = getScrollableElement();
    if (!el) {
      return;
    }

    const maxScrollTop = getMaxScrollTop(el);

    canScrollUp.value = el.scrollTop > 0;
    canScrollDown.value = el.scrollTop < maxScrollTop;
  };

  const handleScroll = () => {
    updateScrollIndicators();
  };

  const scrollByOptions = (optionsCount: number) => {
    const el = getScrollableElement();
    if (!el) {
      return;
    }

    const maxScrollTop = getMaxScrollTop(el);
    const currentSnap = snapToOptionHeight(el.scrollTop);

    const nextScrollTop = clampScrollTop(
      currentSnap + optionsCount * OPTION_HEIGHT_PX,
      maxScrollTop,
    );

    el.scrollTo({
      top: nextScrollTop,
      behavior: 'smooth',
    });
  };

  watch(
    [isOpenRef, optionsRef],
    async ([isOpen]) => {
      if (!isOpen) {
        return;
      }

      await nextTick();

      const el = getScrollableElement();
      if (!el) {
        return;
      }

      const selectedItem = el.querySelector<HTMLElement>(
        '[data-selected="true"]',
      );

      if (selectedItem) {
        const items = el.children;
        let selectedIndex = -1;

        for (let i = 0; i < items.length; i++) {
          if (items[i] === selectedItem) {
            selectedIndex = i;
            break;
          }
        }

        if (selectedIndex >= 0) {
          const maxScrollTop = getMaxScrollTop(el);
          const targetIndex = Math.max(
            0,
            selectedIndex - DEFAULT_VISIBLE_OFFSET,
          );

          el.scrollTop = clampScrollTop(
            targetIndex * OPTION_HEIGHT_PX,
            maxScrollTop,
          );
        }
      }

      updateScrollIndicators();
    },
    { deep: true },
  );

  return {
    canScrollUp,
    canScrollDown,
    handleScroll,
    scrollByOptions,
  };
}
