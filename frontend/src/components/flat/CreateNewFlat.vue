<script setup lang="ts">
import { ref } from 'vue'
import { useFlat } from '@/composables/useFlat'

const name = ref('')
const { createFlat } = useFlat()

const emits = defineEmits<{
  (event: 'submit'): void
}>()

async function handleCreate() {
  await createFlat(name.value)
  emits('submit')
}
</script>

<template>
  <h2 class="card-title">Create a new flat for your not existing friends.</h2>
  <p>You poor thing</p>
  <div class="flex-grow"></div>
  <form class="mt-4 flex-none" @submit.prevent="handleCreate">
    <div class="form-control">
      <input
        class="input input-bordered input-accent mt-4"
        v-model="name"
        name="flatName"
        placeholder="Give it a name"
        type="text"
        required
      />
    </div>
    <div class="justify-center card-actions">
      <button class="btn btn-lg btn-outline btn-accent" type="submit" :disabled="!name">Create</button>
    </div>
  </form>
</template>
