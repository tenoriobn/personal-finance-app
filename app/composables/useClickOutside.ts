import type { Ref } from 'vue';
import { onMounted, onBeforeUnmount } from 'vue';

export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  callback: () => void,
) {
  function handleClick(event: MouseEvent) {
    const element = elementRef.value;
    if (element && !element.contains(event.target as Node)) {
      callback();
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick);
  });
}
