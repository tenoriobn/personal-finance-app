<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Contas Correntes" />
      <Button
        label="Sair"
        @click="logout = true"
      >
        <LogoutIcon class="" />
      </Button>
    </header>
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import LogoutIcon from '~/assets/icons/icon-logout.svg';

const logout = ref(false);
</script>
