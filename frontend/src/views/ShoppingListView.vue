<script setup lang="ts">
import ShoppingList from '@/components/shopping/ShoppingList.vue'
import { onMounted, ref } from 'vue'
import { useShoppingItems } from '../composables/useShoppingItems'
import FabButton from '@/components/FabButton.vue'
import { TrashIcon, ShoppingCartIcon } from '@heroicons/vue/outline'
import CreatePurchase from '@/components/purchases/CreatePurchase.vue'
import { type CreatePurchase as CreatePurchaseType, usePurchases } from '../composables/usePurchases'
import { useFlat } from '../composables/useFlat'
import { useToast } from '../composables/useToast';

const { createItem, deleteItem, fetchItems, shoppingItems, updateItem } = useShoppingItems()
const { createPurchase } = usePurchases()
const { flat } = useFlat()

const checked = ref<number[]>([])
const { notify } = useToast()

onMounted(async () => {
  await fetchItems()
})

const handleDelete = async () => {
  await Promise.all(checked.value.map((id) => deleteItem(id)))
}

const handleCreatePurchase = async (purchase: CreatePurchaseType) => {
  await createPurchase(purchase)
  shoppingItems.value = shoppingItems.value.filter(({ id }) => !purchase.shoppingItems?.includes(id))
  notify('Purchase created', 'success')
}
</script>

<template>
  <ShoppingList
    class="w-full overflow-scroll"
    v-model:checked="checked"
    :items="shoppingItems.sort((a, b) => b.id - a.id)"
    @create="createItem"
    @delete="deleteItem($event.id)"
    @update="updateItem"
  />
  <teleport to="body">
    <transition name="scale">
      <FabButton v-show="checked.length" class="z-10">
        <label
          for="create-purchase-modal"
          class="btn btn-circle btn-secondary modal-button mb-2"
          title="create purchase"
        >
          <ShoppingCartIcon class="h-6 w-6" />
        </label>
        <input type="checkbox" id="create-purchase-modal" class="modal-toggle" />
        <CreatePurchase v-if="flat" @create="handleCreatePurchase" :members="flat.members" :shoppingItems="checked" />
        <button class="btn btn-circle btn-error" title="delete" @click="handleDelete">
          <TrashIcon class="h-6 w-6" />
        </button>
      </FabButton>
    </transition>
  </teleport>
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
