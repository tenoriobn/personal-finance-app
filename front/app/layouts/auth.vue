<template>
  <main class="bg-beige-100 grid max-lg:grid-rows-[auto_1fr] lg:grid-cols-2 min-h-dvh gap-10 max-lg:pb-10 lg:md:p-10">
    <header class="max-lg:bg-grey-900 background grid max-lg:place-items-center max-lg:py-8 lg:md:p-10 max-lg:rounded-b-2xl lg:rounded-2xl">
      <Logo />

      <div class="max-lg:hidden self-end">
        <h3 class="text-white max-md:text-2xl md:text-[2rem] font-bold leading-none">Controle suas finanças e poupe para o futuro.</h3>
        <p class="text-white text-base mt-4">
          O aplicativo de finanças pessoais coloca você no controle dos seus gastos. Monitore transações, defina orçamentos e adicione dinheiro às suas economias com facilidade.
        </p>
      </div>
    </header>

    <section class="grid place-items-center max-md:px-4">
      <div class="bg-white flex flex-col justify-center gap-8 w-full max-md:p-6 md:p-10 rounded-2xl max-lg:max-w-[560px] lg:h-full">
        <slot />
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import Logo from '~/assets/icons/logo-large.svg';
</script>

<style scoped>
@media (min-width: 992px) {
  .background {
    background-image: url('../assets/images/illustration-authentication.svg');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
