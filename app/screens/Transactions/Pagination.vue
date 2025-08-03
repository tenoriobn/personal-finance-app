<template>
  <div class="flex items-center justify-center max-sm:gap-2 sm:gap-4">
    <button
      class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out opacity-60"
      disabled
    >
      <CaretDownIcon />
    </button>

    <button
      class="flex items-center justify-center bg-grey-900 border border-grey-900 text-white py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl "
    >
      1
    </button>

    <button class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out">
      2
    </button>

    <button class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out">
      ...
    </button>

    <button class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out">
      30
    </button>

    <button class="flex items-center justify-center enabled:hover:bg-grey-100 enabled:active:bg-grey-200 border py-2 px-2 max-md:w-9 max-md:h-9 md:w-11 md:h-11 rounded-xl duration-150 ease-in-out -rotate-180">
      <CaretDownIcon />
    </button>
  </div>
</template>

<script lang="ts" setup>
import CaretDownIcon from '~/assets/icons/icon-caret-left.svg';
</script>
