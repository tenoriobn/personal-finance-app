<template>
  <nav
    class="bg-grey-900 max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:w-full max-lg:rounded-t-lg max-lg:pt-2 max-md:px-4 md:max-lg:px-10 lg:rounded-r-2xl lg:py-10 lg:pr-6 lg:grid lg:grid-rows-[auto_1fr_auto] gap-16"
  >
    <div class="max-lg:hidden lg:px-[2.25rem]">
      <Logo />
    </div>

    <ul class="max-lg:flex">
      <li
        v-for="{ to, label, icon } in navLinks"
        :key="to"
        class="w-full flex max-lg:place-content-center max-lg:rounded-t-lg lg:rounded-r-2xl max-lg:border-b-4 lg:border-l-4 p-3 lg:pl-8"
        :class="route.path === to ? 'border-green bg-beige-100' : 'border-grey-900'"
      >
        <NuxtLink
          :to="to"
          class="group flex items-center md:max-lg:flex-col md:max-lg:gap-2 lg:gap-6"
        >
          <component
            :is="icon"
            class="duration-500"
            :class="route.path === to ? 'fill-green' : 'fill-grey-300 group-hover:fill-grey-100'"
          />

          <span
            class="hidden max-lg:text-xs md:block font-bold duration-500"
            :class="route.path === to ? 'text-grey-900' : 'text-grey-300 group-hover:text-grey-100'"
          >
            {{ label }}
          </span>
        </NuxtLink>
      </li>
    </ul>

    <button class="group hidden lg:flex items-center gap-5 font-bold  hover:text-grey-100 lg:mx-[2.25rem] transition-colors">
      <MinimizeMenuIcon class="fill-grey-300 group-hover:fill-grey-100 duration-500 transition-colors " />
      <span class="text-grey-300 group-hover:text-grey-100 duration-500 transition-colors">Minimize Menu</span>
    </button>
  </nav>
</template>

<script lang="ts" setup>
import Logo from '@/assets/icons/logo-large.svg';
import MinimizeMenuIcon from '@/assets/icons/icon-minimize-menu.svg';
import { navLinks } from './navLinks';

const route = useRoute();
</script>
