<template>
  <div class="flex justify-between max-md:gap-4 md:gap-6 h-max">
    <Input
      v-model="searchLocal"
      :label="'Search transaction'"
      :icon="SearchIcon"
      name="search"
      custom-classes="w-full md:max-w-[432px]"
    />

    <div class="flex max-md:justify-center max-md:items-center md:justify-end max-md:gap-3 md:gap-6 md:w-full">
      <Dropdown
        v-model="selectedSortLocal"
        :label="'Sort By'"
        :options="options"
        :icon-mobile="SortIconMobile"
        data-testid="dropdown-sort-by"
        custom-classes="md:w-[112px] 2xl:w-[164px]"
      />

      <Dropdown
        v-model="selectedCategoryLocal"
        :label="'Category'"
        :options="categories"
        :icon-mobile="FilterIconMobile"
        data-testid="dropdown-category"
        custom-classes="md:w-[164px] 2xl:w-[224px]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchIcon from '~/assets/icons/icon-search.svg';
import type { FiltersProps } from './filters.type';
import SortIconMobile from '~/assets/icons/icon-sort-mobile.svg';
import FilterIconMobile from '~/assets/icons/icon-filter-mobile.svg';

const props = defineProps<FiltersProps>();

const emit = defineEmits<{
  (e: 'update:search' | 'update:selectedCategory' | 'update:selectedSort', value: string): void
}>();

const searchLocal = ref(props.search);
const selectedCategoryLocal = ref(props.selectedCategory);
const selectedSortLocal = ref(props.selectedSort);

watch(searchLocal, val => emit('update:search', val));
watch(selectedCategoryLocal, val => emit('update:selectedCategory', val));
watch(selectedSortLocal, val => emit('update:selectedSort', val));

const options = ['Oldest', 'Latest', 'A to Z', 'Z to A', 'Highest', 'Lowest'];
const categories = ['All Transactions', 'Entertainment', 'Bills', 'Groceries', 'Dining Out', 'Transportation'];
</script>
