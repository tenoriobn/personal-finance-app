<template>
  <Dropdown
    v-model="internalValue"
    :label="'Ordenar por'"
    :options="options"
    :icon-mobile="SortIconMobile"
    data-testid="dropdown-sort-by"
    custom-classes="md:w-full max-w-[164px]"
    :compact-on-mobile="true"
  />
</template>

<script lang="ts" setup>
import { Dropdown } from '#components';
import { ref, watch } from 'vue';
import SortIconMobile from '~/assets/icons/icon-sort-mobile.svg';

const props = defineProps<{ modelValue: string }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) {
    internalValue.value = val;
  };
});

watch(internalValue, val => emit('update:modelValue', val));

const options = ['Mais recente', 'Mais antigo', 'A a Z', 'Z a A', 'Mais alto', 'Mais baixo'];
</script>
