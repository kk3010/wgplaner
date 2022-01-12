<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'
import { ref } from 'vue'

import useClipboard from 'vue-clipboard3'

const { flat } = useFlat()
const { toClipboard } = useClipboard()

const copied = ref(false)

const copy = async () => {
  try {
    await toClipboard(flat.value!.invitationToken)
    copied.value = true
    setTimeout(() => (copied.value = false), 3000)
  } catch (e) {
    console.error(e)
  }
}
</script>
<template>
  <div class="form-control">
    <div class="relative lg:max-w-md">
      <p class="pr-16 input flex flex-auto items-center input-primary font-bold uppercase input-bordered">
        {{ flat?.invitationToken }}
      </p>
      <button @click="copy" title="Copy to clipboard" class="absolute top-0 right-0 rounded-l-none btn btn-primary">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
  </div>
</template>
