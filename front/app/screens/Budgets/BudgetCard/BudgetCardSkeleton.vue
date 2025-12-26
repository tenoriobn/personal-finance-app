<template>
  <div
    v-for="n in 2"
    :key="n"
    class="bg-white rounded-xl max-md:p-4 md:p-[2rem] shadow-lg shadow-grey-500/20"
  >
    <div class="flex justify-between items-center animate-pulse">
      <div class="flex items-center gap-2">
        <span class="bg-grey-200 block w-4 h-4 rounded-full" />
        <div class="h-6 w-36 rounded bg-grey-200" />
      </div>

      <div class="w-6 h-3 rounded bg-grey-200" />
    </div>

    <div class="h-5 w-36 rounded bg-grey-200 mt-6 animate-pulse" />

    <div class="h-7 w-full rounded bg-grey-200 mt-4 animate-pulse" />

    <div class="flex items-center mt-4 animate-pulse">
      <div class="relative flex flex-1 gap-2 flex-col justify-between pl-4">
        <span class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-grey-200" />
        <div class="w-10 h-4 rounded bg-grey-200" />
        <div class="w-24 h-5 rounded bg-grey-200" />
      </div>

      <div class="relative flex flex-1 gap-2 flex-col justify-between pl-4">
        <span class="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-grey-200" />
        <div class="w-10 h-4 rounded bg-grey-200" />
        <div class="w-24 h-5 rounded bg-grey-200" />
      </div>
    </div>

    <div class="bg-beige-100 rounded-xl mt-6 p-4">
      <div class="w-full animate-pulse">
        <div class="flex justify-between items-center gap-4 pb-2">
          <div class="max-w-36 w-full h-6 rounded bg-grey-200" />
          <div class="max-w-20 w-full h-4 rounded bg-grey-200" />
        </div>

        <div
          v-for="x in 3"
          :key="x"
          class="grid grid-cols-[1fr_auto] grid-rows-2 items-center max-sm:gap-2 sm:gap-x-4 py-4 last:pb-0 border-b last:border-b-0"
        >
          <div class="row-span-2 flex items-center max-sm:gap-2 sm:gap-4 text-grey-900 font-bold">
            <div class="max-sm:max-w-8 max-sm:h-8 sm:max-w-10 w-full sm:h-10 rounded-full grid place-items-center bg-grey-200" />
            <div class="w-24 h-5 rounded bg-grey-200" />
          </div>

          <div class="w-20 h-5 rounded bg-grey-200 col-start-3 row-start-2 mt-1" />
          <div class="w-20 h-5 rounded bg-grey-200 col-start-3 row-start-1" />
        </div>
      </div>
    </div>
  </div>
</template>
