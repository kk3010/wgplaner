<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/outline'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'
import { ref, reactive } from 'vue'
import { useVModel, onClickOutside, useSwipe } from '@vueuse/core'

const props = defineProps<{
  item: IShoppingItem
  checked: number[]
}>()

const emit = defineEmits<{
  (event: 'update:checked'): void
  (event: 'update', item: IShoppingItem): void
  (event: 'delete', data: IShoppingItem): void
}>()

const changedItem = reactive({ ...props.item })

const editing = ref(false)

const checkedModel = useVModel(props, 'checked', emit)

const row = ref()

const handleUpdate = () => {
  editing.value = false
  if (props.item.name !== changedItem.name || props.item.quantity !== changedItem.quantity) {
    emit('update', changedItem)
  }
}

const left = ref(0)

const { lengthX, coordsStart, isSwiping } = useSwipe(row, {
  threshold: 20,
  onSwipe() {
    if (lengthX.value < 0) {
      left.value = Math.abs(lengthX.value) / (row.value.offsetWidth - coordsStart.x)
    } else {
      left.value = 0
    }
    row.value.style = `transform: translate(${left.value * 100}%)`
  },
  onSwipeEnd() {
    if (left.value >= 0.5) {
      emit('delete', props.item)
      row.value.style = `transform: translate(100%)`
    } else {
      row.value.style = ''
    }
  },
})

onClickOutside(row, handleUpdate)
</script>

<template>
  <tr ref="row" :class="{ 'transition duration-300': !isSwiping }" @keydown="$event.key === 'Enter' && handleUpdate()">
    <template v-if="editing">
      <th></th>
      <td>
        <input type="number" class="input input-bordered w-16 lg:w-auto" v-model.number="changedItem.quantity" />
      </td>
      <td>
        <input type="text" class="input input-bordered w-20 lg:w-auto" v-model="changedItem.name" />
      </td>
      <td></td>
    </template>
    <template v-else>
      <th>
        <label title="select">
          <input type="checkbox" class="checkbox" :value="item.id" v-model="checkedModel" />
        </label>
      </th>
      <td>{{ item.quantity }}</td>
      <td class="font-bold truncate">{{ item.name }}</td>
      <td>
        <button class="btn btn-circle btn-ghost" @click="editing = true">
          <PencilIcon class="w-6 h-6" />
        </button>
      </td>
    </template>
  </tr>
</template>
