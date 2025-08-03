<template>
  <div class="flex max-md:flex-col md:justify-between gap-6">
    <Input
      v-model="search"
      :label="'Search transaction'"
      :icon="SearchIcon"
      name="search"
      custom-classes="w-full md:max-w-[432px]"
    />

    <div class="flex max-sm:flex-col md:justify-end w-full gap-6">
      <Dropdown
        v-model="selectedOption"
        :label="'Sort By'"
        :options="options"
        custom-classes="w-full sm:max-w-[164px]"
      />

      <Dropdown
        v-model="selectedCategory"
        :label="'Category'"
        :options="categorias"
        custom-classes="w-full sm:max-w-[224px]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchIcon from '~/assets/icons/icon-search.svg';

const options = ['Oldest', 'Latest', 'A to Z', 'Z to A', 'Highest', 'Lowest'];
const selectedOption = ref(options[0]);

const categorias = ['All Transactions', 'Entertainment', 'Bills', 'Groceries', 'Dining Out', 'Transportation'];
const selectedCategory = ref(categorias[0]);

const search = ref('');
</script>
