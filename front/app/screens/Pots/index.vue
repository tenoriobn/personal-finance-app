<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Fundos" />
      <Button
        label="+Novo Fundo"
        @click="showCreatePotModal = true"
      />
    </header>

    <div class="grid md:max-xl:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
      <PotCard />
    </div>

    <CreatePotModal
      v-model="showCreatePotModal"
      @refresh-pots="refreshGetPots"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import PotCard from './PotCard/index.vue';
import CreatePotModal from './CreatePotModal/index.vue';
import { usePots } from './usePots';

const { getPots, refreshPots } = usePots();
getPots();

const showCreatePotModal = ref(false);

const refreshGetPots = async () => {
  await refreshPots();
};
</script>
