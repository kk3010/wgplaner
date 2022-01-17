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
  <div class="flex items-center gap-4">
    <template v-if="editing">
      <input type="text" :placeholder="flatName" class="inline-block input input-bordered flex-1" v-model="newName" />
      <button title="Save changes" @click="handleUpdate" :class="`btn btn-circle ml-2 btn-primary`">
        <CheckIcon class="w-6 h-6" />
      </button>
    </template>

    <template v-else>
      <p class="font-bold truncate text-base">{{ flatName }}</p>
      <button title="Rename flat" class="btn btn-circle btn-ghost ml-2" @click="editing = true">
        <PencilIcon class="w-6 h-6" />
      </button>
    </template>
  </div>
</template>
