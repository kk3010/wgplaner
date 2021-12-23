<script setup lang="ts">
import ShoppingList from '@/components/shopping/ShoppingList.vue'
import { onMounted, ref } from 'vue'
import { useShoppingItems } from '../composables/useShoppingItems'
import FabButton from '@/components/FabButton.vue'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'

const { createItem, deleteItem, fetchItems, shoppingItems, updateItem } = useShoppingItems()

const checked = ref<IShoppingItem[]>([])

onMounted(async () => {
  await fetchItems()
})
</script>

<template>
  <div class="relative overflow-x-auto">
    <ShoppingList class="w-full" v-model="checked" :items="shoppingItems" />
    <transition name="scale">
      <FabButton v-show="checked.length">
        <button class="btn btn-circle btn-secondary" title="create purchase">c</button>
        <button class="btn btn-circle btn-error" title="delete">del</button>
      </FabButton>
    </transition>
  </div>
</template>

<style>
.scale-enter-active,
.scale-leave-active {
  @apply transition;
}

.scale-enter-from,
.scale-leave-to {
  @apply opacity-0 scale-90;
}
</style>
