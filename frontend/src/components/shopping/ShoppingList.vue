<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import NewItemRow from './NewItemRow.vue'
import ItemRow from './ItemRow.vue'
import type { NewShoppingItem, UpdateShoppingItem } from '../../composables/useShoppingItems'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'

enum SelectionState {
  NONE,
  SOME,
  ALL,
}

const table = ref()
const list = ref()

const props = defineProps<{
  items: IShoppingItem[]
  checked: number[]
}>()

const emit = defineEmits<{
  (event: 'update:checked', items: IShoppingItem[]): void
  (event: 'create', item: NewShoppingItem): void
  (event: 'update', item: UpdateShoppingItem): void
  (event: 'delete', item: IShoppingItem): void
}>()

const checkedModel = useVModel(props, 'checked', emit)

const selectionState = ref<SelectionState>(SelectionState.NONE)

watch(checkedModel, (checked) => {
  switch (checked.length) {
    case 0:
      selectionState.value = SelectionState.NONE
      break
    case props.items.length:
      selectionState.value = SelectionState.ALL
      break
    default:
      selectionState.value = SelectionState.SOME
      break
  }
})

// evict ids from checked array when they do not longer exist in props.items
watch(
  toRef(props, 'items'),
  (items) => (checkedModel.value = checkedModel.value.filter((item) => items.some(({ id }) => id === item))),
)

const handleSelectAll = () => {
  if (selectionState.value === SelectionState.ALL) {
    checkedModel.value = []
  } else {
    checkedModel.value = props.items.map(({ id }) => id)
  }
}

const toggleOverflow = (state: boolean) =>
  [table, list].map((elem) => elem.value?.classList.toggle('overflow-x-hidden', state))
</script>

<template>
  <table class="table table-compact table-zebra" ref="table">
    <thead>
      <tr>
        <th>
          <label title="select all">
            <input
              type="checkbox"
              class="checkbox"
              :class="{ 'bg-base-content': selectionState === SelectionState.SOME }"
              :checked="selectionState === SelectionState.ALL"
              @change="handleSelectAll"
            />
          </label>
        </th>
        <th>Quantity</th>
        <th>What</th>
        <th></th>
      </tr>
    </thead>
    <tbody ref="list">
      <transition-group
        name="shopping-list"
        @before-enter="toggleOverflow(true)"
        @before-leave="toggleOverflow(true)"
        @after-enter="toggleOverflow(false)"
        @after-leave="toggleOverflow(false)"
      >
        <NewItemRow @create="$emit('create', $event)" key="newRow" />
        <ItemRow
          v-for="item in items"
          :key="item.id"
          :item="item"
          v-model:checked="checkedModel"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
        />
      </transition-group>
    </tbody>
  </table>
</template>

<style>
.shopping-list-enter-from,
.shopping-list-leave-to {
  @apply opacity-0 translate-x-[100%];
}

.shopping-list-enter-active {
  @apply ease-out;
}

.shopping-list-leave-active {
  @apply ease-in;
}
</style>
