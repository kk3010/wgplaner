<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { NewShoppingItem } from '@/composables/useShoppingItems'
import { onClickOutside } from '@vueuse/core'

const item = reactive<NewShoppingItem>({
  name: '',
  quantity: 1,
})

const emit = defineEmits<{
  (event: 'create', data: NewShoppingItem): void
}>()

const row = ref()

const handleSave = () => {
  if (item.name) {
    emit('create', item)
    item.name = ''
    item.quantity = 1
  }
}

onClickOutside(row, handleSave)
</script>

<template>
  <tr ref="row" @keydown="$event.key === 'Enter' && handleSave()">
    <td></td>
    <td>
      <input type="number" class="input input-bordered" v-model.number="item.quantity" min="1" />
    </td>
    <td>
      <input type="text" placeholder="name" class="input input-bordered" v-model="item.name" />
    </td>
    <td></td>
  </tr>
</template>
