<template>
  <div class="flex justify-between items-center max-md:gap-4 md:gap-6 h-max">
    <Input
      v-model="searchLocal"
      :label="'Pesquisar conta'"
      :icon="SearchIcon"
      name="search"
      custom-classes="w-full md:max-w-[400px]"
    />

    <SortByDropdown
      v-model="selectedSortLocal"
    />
  </div>
</template>

<script lang="ts" setup>
import { Input } from '#components';
import SortByDropdown from '~/components/Dropdown/SortByDropdown/index.vue';
import { ref } from 'vue';
import SearchIcon from '~/assets/icons/icon-search.svg';
import type { FiltersProps } from './filters.type';

const props = defineProps<FiltersProps>();

const emit = defineEmits<{ (e: 'update:search' | 'update:selectedSort', value: string): void }>();

const searchLocal = ref(props.search);
watch(searchLocal, val => emit('update:search', val));

const selectedSortLocal = ref(props.selectedSort);
watch(selectedSortLocal, val => emit('update:selectedSort', val));
</script>
