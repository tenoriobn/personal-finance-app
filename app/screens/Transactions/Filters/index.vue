<template>
  <div class="flex justify-between max-md:gap-4 md:gap-6 h-max">
    <Input
      v-model="searchLocal"
      :label="'Pesquisar transações'"
      :icon="SearchIcon"
      name="search"
      custom-classes="w-full md:max-w-[432px]"
    />

    <div class="flex max-md:justify-center max-md:items-center md:justify-end max-md:gap-3 md:gap-6 md:w-full">
      <SortByDropdown
        v-model="selectedSortLocal"
      />

      <Dropdown
        v-model="selectedCategoryLocal"
        :label="'Categoria'"
        :options="categories"
        :icon-mobile="FilterIconMobile"
        data-testid="dropdown-category"
        custom-classes="md:w-[160px] 2xl:w-[224px]"
        :compact-on-mobile="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Input, Dropdown } from '#components';
import SortByDropdown from '~/components/Dropdown/SortByDropdown/index.vue';
import { ref } from 'vue';
import SearchIcon from '~/assets/icons/icon-search.svg';
import type { FiltersProps } from './filters.type';
import FilterIconMobile from '~/assets/icons/icon-filter-mobile.svg';

const props = defineProps<FiltersProps>();

const emit = defineEmits<{
  (e: 'update:search' | 'update:selectedCategory' | 'update:selectedSort', value: string): void
}>();

const searchLocal = ref(props.search);
watch(searchLocal, val => emit('update:search', val));

const selectedCategoryLocal = ref(props.selectedCategory);
watch(selectedCategoryLocal, val => emit('update:selectedCategory', val));

const selectedSortLocal = ref(props.selectedSort);
watch(selectedSortLocal, val => emit('update:selectedSort', val));

const categories = ['Todos', 'Entretenimento', 'Fundos', 'Alimentos', 'Jantar fora', 'Transporte'];
</script>
