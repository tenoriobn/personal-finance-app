<template>
  <div class="flex max-md:flex-col md:justify-between gap-6 h-max">
    <Input
      v-model="searchLocal"
      :label="'Search transaction'"
      :icon="SearchIcon"
      name="search"
      custom-classes="w-full md:max-w-[432px]"
    />

    <div class="flex max-sm:flex-col md:justify-end w-full gap-6">
      <Dropdown
        v-model="selectedSortLocal"
        :label="'Sort By'"
        :options="options"
        custom-classes="w-full sm:max-w-[164px]"
      />

      <Dropdown
        v-model="selectedCategoryLocal"
        :label="'Category'"
        :options="categories"
        custom-classes="w-full sm:max-w-[224px]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchIcon from '~/assets/icons/icon-search.svg';
import type { FiltersProps } from './filters.type';

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
