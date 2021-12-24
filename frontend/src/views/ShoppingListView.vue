<script setup lang="ts">
import ShoppingList from '@/components/shopping/ShoppingList.vue'
import { onMounted, ref } from 'vue'
import { useShoppingItems } from '../composables/useShoppingItems'
import FabButton from '@/components/FabButton.vue'
import { TrashIcon, ShoppingCartIcon } from '@heroicons/vue/outline'

const { createItem, deleteItem, fetchItems, shoppingItems, updateItem } = useShoppingItems()

const checked = ref<number[]>([])

onMounted(async () => {
  await fetchItems()
})

const handleDelete = async () => {
  await Promise.all(checked.value.map((id) => deleteItem(id)))
}
</script>

<template>
  <div>
    <ShoppingList
      class="w-full"
      v-model:checked="checked"
      :items="shoppingItems.sort((a, b) => b.id - a.id)"
      @create="createItem"
      @update="updateItem"
    />
    <transition name="scale">
      <FabButton v-show="checked.length">
        <button class="btn btn-circle btn-secondary" title="create purchase">
          <ShoppingCartIcon class="h-6 w-6" />
        </button>
        <button class="btn btn-circle btn-error" title="delete" @click="handleDelete">
          <TrashIcon class="h-6 w-6" />
        </button>
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
