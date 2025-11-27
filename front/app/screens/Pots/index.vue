<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Poupanças" />
      <Button
        label="+Nova Poupança"
        @click="showCreatePotModal = true"
      />
    </header>

    <div class="grid md:max-xl:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
      <PotCard
        @edit-pot="openEdit"
        @delete-pot="openDelete"
      />
    </div>

    <CreatePotModal
      v-model="showCreatePotModal"
      @refresh-pots="refreshGetPots"
    />

    <EditPotModal
      v-model="showEditPotModal"
      :pot="potToEdit"
      @refresh-pots="refreshGetPots"
    />

    <DeletePotModal
      v-model="showDeletePotModal"
      :pot="potToDelete"
      @refresh-pots="refreshGetPots"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, TitleSection } from '#components';
import PotCard from './PotCard/index.vue';
import CreatePotModal from './CreatePotModal/index.vue';
import EditPotModal from './EditPotModal/index.vue';
import DeletePotModal from './DeletePotModal/index.vue';
import { usePots } from './usePots';
import type { PotData } from './pots.type';

const { getPots, pots, refreshPots } = usePots();
getPots();

const showCreatePotModal = ref(false);

const showEditPotModal = ref(false);
const potToEdit = ref<PotData | null>(null);
const openEdit = (id: string) => {
  potToEdit.value = pots.value.find(pot => pot.id === id) || null;
  showEditPotModal.value = true;
};

const showDeletePotModal = ref(false);
const potToDelete = ref<PotData | null>(null);
const openDelete = (id: string) => {
  potToDelete.value = pots.value.find(pot => pot.id === id) || null;
  showDeletePotModal.value = true;
};

const refreshGetPots = async () => {
  await refreshPots();
};
</script>
