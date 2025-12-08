<template>
  <div class="grid grid-rows-[auto_1fr] max-md:gap-8 md:gap-10">
    <header class="flex justify-between items-center gap-2 flex-wrap">
      <TitleSection title="Poupanças" />
      <Button
        label="+Nova Poupança"
        @click="showCreatePotModal = true"
      />
    </header>

    <PotCard
      @edit-pot="openEdit"
      @delete-pot="openDelete"
      @add-money="openAddMoney"
      @withdraw-money="openWithdrawMoney"
    />

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

    <PotAddMoneyModal
      v-model="showAddMoneyModal"
      :pot="potToAddMoney"
      @refresh-pots="refreshGetPots"
    />

    <PotWithdrawMoneyModal
      v-model="showWithdrawMoneyModal"
      :pot="potToWithdraw"
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
import PotAddMoneyModal from './PotAddMoneyModal/index.vue';
import PotWithdrawMoneyModal from './PotWithdrawMoneyModal/index.vue';
import { usePots } from './usePots';
import type { PotData } from './pots.type';

const { pots, refreshPots } = usePots();

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

const showAddMoneyModal = ref(false);
const potToAddMoney = ref<PotData | null>(null);
const openAddMoney = (id: string) => {
  potToAddMoney.value = pots.value.find(pot => pot.id === id) || null;
  showAddMoneyModal.value = true;
};

const showWithdrawMoneyModal = ref(false);
const potToWithdraw = ref<PotData | null>(null);

const openWithdrawMoney = (id: string) => {
  potToWithdraw.value = pots.value.find(pot => pot.id === id) || null;
  showWithdrawMoneyModal.value = true;
};

const refreshGetPots = async () => {
  await refreshPots();
};
</script>
