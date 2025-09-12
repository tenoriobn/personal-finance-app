<template>
  <div class="flex justify-between items-center max-md:gap-4 md:gap-6 h-max">
    <Input
      v-model="searchLocal"
      :label="'Pesquisar conta'"
      :icon="SearchIcon"
      name="search"
      custom-classes="w-full md:max-w-[400px]"
    />

    <Dropdown
      v-model="selectedSortLocal"
      :label="'Ordenar por'"
      :options="options"
      :icon-mobile="SortIconMobile"
      data-testid="dropdown-sort-by"
      custom-classes="md:w-full max-w-[164px]"
      :compact-on-mobile="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { Input, Dropdown } from '#components';
import { ref } from 'vue';
import SearchIcon from '~/assets/icons/icon-search.svg';
import type { FiltersProps } from './filters.type';
import SortIconMobile from '~/assets/icons/icon-sort-mobile.svg';

const props = defineProps<FiltersProps>();

const emit = defineEmits<{
  (e: 'update:search' | 'update:selectedSort', value: string): void
}>();

const searchLocal = ref(props.search);
const selectedSortLocal = ref(props.selectedSort);

watch(searchLocal, val => emit('update:search', val));
watch(selectedSortLocal, val => emit('update:selectedSort', val));

const options = ['Mais recente', 'Mais antigo', 'A a Z', 'Z a A', 'Mais alto', 'Mais baixo'];
</script>
