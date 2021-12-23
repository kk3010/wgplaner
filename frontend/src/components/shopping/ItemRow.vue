<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/outline'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'
import { ref, reactive } from 'vue'
import { useVModel, onClickOutside } from '@vueuse/core'

const props = defineProps<{
  item: IShoppingItem
  checked: number[]
}>()

const emit = defineEmits<{
  (event: 'update:checked'): void
  (event: 'update', item: IShoppingItem): void
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

onClickOutside(row, handleUpdate)
</script>

<template>
  <tr ref="row" @keydown="$event.key === 'Enter' && handleUpdate()">
    <template v-if="editing">
      <th></th>
      <td>
        <input type="number" class="input input-bordered" v-model.number="changedItem.quantity" />
      </td>
      <td>
        <input type="text" class="input input-bordered" v-model="changedItem.name" />
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
