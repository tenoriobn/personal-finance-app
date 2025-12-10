<template>
  <div class="bg-beige-100 min-h-dvh lg:grid lg:grid-cols-[auto_1fr] max-md:mb-[56px] md:max-lg:mb-[80px]">
    <Navbar />

    <main class="min-h-dvh max-md:py-6 max-md:px-4 md:p-10">
      <slot />
    </main>
  </div>
</template>
