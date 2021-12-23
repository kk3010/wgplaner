<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import NewItemRow from './NewItemRow.vue'
import ItemRow from './ItemRow.vue'
import type { NewShoppingItem, UpdateShoppingItem } from '../../composables/useShoppingItems'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'

const allChecked = ref(false)

const props = defineProps<{
  items: IShoppingItem[]
  checked: number[]
}>()

const emit = defineEmits<{
  (event: 'update:checked', items: IShoppingItem[]): void
  (event: 'create', item: NewShoppingItem): void
  (event: 'update', item: UpdateShoppingItem): void
}>()

const checkedModel = useVModel(props, 'checked', emit)

watch(allChecked, (all) => (checkedModel.value = all ? props.items.map(({ id }) => id) : []))

watch(
  toRef(props, 'items'),
  (items) => (checkedModel.value = checkedModel.value.filter((item) => items.some(({ id }) => id === item))),
)
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
        <th></th>
      </tr>
    </thead>
    <transition-group tag="tbody" name="shopping-list">
      <NewItemRow @create="$emit('create', $event)" key="newRow" />
      <ItemRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        v-model:checked="checkedModel"
        @update="$emit('update', $event)"
      />
    </transition-group>
  </table>
</template>

<style>
.shopping-list-move {
  @apply transition-transform;
}
</style>
