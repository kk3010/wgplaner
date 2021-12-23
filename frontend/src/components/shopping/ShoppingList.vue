<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'
import { useVModel } from '@vueuse/core'

const allChecked = ref(false)

const props = defineProps<{
  items: IShoppingItem[]
  modelValue: IShoppingItem[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', items: IShoppingItem[]): void
}>()

const checked = useVModel(props, 'modelValue', emit)

watchEffect(() => {
  checked.value = allChecked.value ? props.items : []
})
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>
          <label title="select all">
            <input type="checkbox" class="checkbox" v-model="allChecked" />
          </label>
        </th>
        <th>Quantity</th>
        <th>What</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <th>
          <label title="select">
            <input type="checkbox" class="checkbox" :value="item" v-model="checked" />
          </label>
        </th>
        <td>{{ item.quantity }}</td>
        <td class="font-bold truncate">{{ item.name }}</td>
      </tr>
    </tbody>
  </table>
</template>
