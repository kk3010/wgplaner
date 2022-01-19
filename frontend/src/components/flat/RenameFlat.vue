<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'
import { PencilIcon } from '@heroicons/vue/outline'
import { CheckIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'

const { updateFlat } = useFlat()
const editing = ref(false)
const newName = ref('')

defineProps<{
  flatName: string
}>()

const handleUpdate = async () => {
  editing.value = false
  await updateFlat(newName.value)
}
</script>
<template>
  <div>
    <form v-if="editing" class="w-full" @submit.prevent="handleUpdate">
      <div class="form-control">
        <label for="flat-name" class="label"><span class="label-text">Flat Name</span></label>
        <div class="flex space-x-2">
          <input type="text" :placeholder="flatName" class="input input-bordered w-full" v-model="newName" />
          <button title="Save changes" type="submit" :class="`btn btn-circle ml-2 btn-primary`">
            <CheckIcon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>
    <div v-else class="w-full flex items-center space-x-4">
      <p class="font-bold truncate">{{ flatName }}</p>
      <button title="Rename flat" class="btn btn-circle btn-ghost ml-2" @click="editing = true">
        <PencilIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
