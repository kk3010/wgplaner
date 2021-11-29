<script setup lang="ts">
import CreateNewFlat from '@/components/flat/CreateNewFlat.vue'
import JoinExistingFlat from '@/components/flat/JoinExistingFlat.vue'
</script>

<template>
  <div class="flex flex-col w-full lg:flex-row">
    <div class="card text-center shadow-2xl p-12 flex-grow m-10 place-items-center">
      <div class="card-body">
        <CreateNewFlat />
      </div>
    </div>

    <div class="divider m-6 lg:divider-vertical">OR</div>

    <div class="card text-center flex-grow m-10 shadow-2xl p-12">
      <div class="card-body">
        <JoinExistingFlat />
      </div>
    </div>
  </div>
</template>
