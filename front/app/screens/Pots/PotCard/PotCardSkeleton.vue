<template>
  <div class="grid md:max-xl:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
    <div
      v-for="n in 2"
      :key="n"
      class="bg-white rounded-xl max-md:p-4 md:p-[2rem]"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="bg-grey-200 block w-4 h-4 rounded-full" />
          <div class="h-7 w-40 rounded bg-grey-200" />
        </div>

        <div class="w-6 h-3 rounded bg-grey-200" />
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="h-5 w-32 rounded bg-grey-200" />
        <div class="h-8 w-28 rounded bg-grey-200" />
      </div>

      <div class="h-2 w-full rounded bg-grey-200 mt-4" />

      <div class="flex justify-between items-center mt-2">
        <div class="h-4 w-10 rounded bg-grey-200" />
        <div class="h-4 w-28 rounded bg-grey-200" />
      </div>

      <div class="flex max-sm:flex-col gap-4 mt-6">
        <div class="bg-grey-200 min-w-28 w-full h-[2.875rem] rounded-xl" />
        <div class="bg-grey-200 min-w-28 w-full h-[2.875rem] rounded-xl" />
      </div>
    </div>
  </div>
</template>
