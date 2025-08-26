export function useClickOutside(elementRef: Ref<HTMLElement | null>, callback: () => void) {
  function handleClick(event: MouseEvent) {
    const element = elementRef.value;
    if (element && !element.contains(event.target as Node)) {
      callback();
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClick);
  });
}
