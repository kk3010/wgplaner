<script setup lang="ts">
import CreateNewFlat from '@/components/flat/CreateNewFlat.vue'
import JoinExistingFlat from '@/components/flat/JoinExistingFlat.vue'
import { useUser } from '../composables/useUser'
import { useRouter } from 'vue-router'

const { getUser } = useUser()
const { push } = useRouter()

async function handleSubmit() {
  await getUser()
  await push('/')
}
</script>

<template>
  <div class="flex flex-col justify-center lg:w-full lg:flex-row">
    <div class="card text-center shadow-2xl max-w-sm">
      <div class="card-body">
        <CreateNewFlat @submit="handleSubmit" />
      </div>
    </div>

    <div class="divider mx-0 lg:divider-vertical max-w-sm lg:mx-6">OR</div>

    <div class="card text-center shadow-2xl max-w-sm">
      <div class="card-body">
        <JoinExistingFlat @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>
