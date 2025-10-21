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
// import { useApi } from '~/utils/api/useApi';
// import { api } from '~/utils/api/methods';

const logout = ref(false);

// const { data: users } = await useApi('/users');
// console.log('lista de usuários: ', users.value);

// onMounted(async () => {
//   // const transactionData = {
//   //   name: 'Serenity Spa & Wellness',
//   //   date: '2024-08-03T14:00:37Z',
//   //   amount: 1000,
//   //   recurring: true,
//   //   userId: '68cc2f9fa15a75f4a2c29d9d',
//   //   budgetId: '68efd9a4df0e0dac482364ba',
//   // };

//   // const transactionUpdateData = {
//   //   name: 'Clark Kent',
//   //   recurring: false,
//   // };

//   // const { data: users } = await api.get('/users');
//   // console.log('todos os usuárioss: ', users);

//   // const fetchTransaction = async () => {
//   //   const { data: transaction } = await api.get('/transactions/68e56a63de9ef6eb4d207be5');
//   //   console.log('Transação especifica: ', transaction);

//   // if (error) {
//   //   console.error(error);
//   // }
//   // else {
//   //   console.log('Criado:', data);
//   // }
//   // };

//   // const createBudget = async () => {
//   //   const { data, error } = await api.post('/transactions', transactionData);
//   //   if (error) {
//   //     console.error(error);
//   //   }
//   //   else {
//   //     console.log('Criado:', data);
//   //   }
//   // };

//   // const updateTransaction = async () => {
//   //   const { data } = await api.put('/transactions/68f29e24dd3e624e8086d4db', transactionUpdateData);
//   //   console.log('Modificado:', data);
//   // };

//   // const deleteBudget = async () => {
//   //   const { data, error } = await api.del('/transactions/68f29e24dd3e624e8086d4db');
//   //   if (error) {
//   //     console.error(error);
//   //   }
//   //   else {
//   //     console.log('Deletado:', data);
//   //   }
//   // };
// });
</script>
