import { ref, onMounted, watch, nextTick, type Ref } from 'vue';
import type { DropdownOption } from './dropdown.type';

export function useDropdownScroll(
  dropdownList: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  options: Ref<(string | DropdownOption)[]>,
) {
  const canScroll = ref(false);
  const atTop = ref(true);
  const atBottom = ref(false);

  const recalcScrollState = () => {
    const listElement = dropdownList.value;
    if (!listElement) {
      return;
    }

    canScroll.value = listElement.scrollHeight > listElement.clientHeight + 1;
    atTop.value = listElement.scrollTop <= 0;
    atBottom.value
      = listElement.scrollTop + listElement.clientHeight
        >= listElement.scrollHeight - 1;
  };

  const handleScroll = () => recalcScrollState();

  watch(
    [isOpen, options],
    async ([open]) => {
      if (open) {
        await nextTick();
        recalcScrollState();
      }
      else {
        canScroll.value = false;
        atTop.value = true;
        atBottom.value = false;
      }
    },
    { deep: true },
  );

  onMounted(() => recalcScrollState());

  return { canScroll, atTop, atBottom, handleScroll };
}
