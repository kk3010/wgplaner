<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import type { CreatePurchase } from '@/composables/usePurchases'
import type { IUser } from '@interfaces/user.interface'

const props = defineProps<{
  members: IUser[]
  shoppingItems: number[]
}>()

const emit = defineEmits<{
  (event: 'create', data: CreatePurchase): void
}>()

const accept = ref()

const { members, shoppingItems } = toRefs(props)

const purchase = reactive({
  name: '',
  payers: members,
  shoppingItems,
  price: 1,
})

const handleSubmit = () => {
  emit('create', { ...purchase, payers: purchase.payers.map(({ id }) => id) })
}
</script>

<template>
  <div class="modal">
    <div class="modal-box">
      <form class="space-y-4" @keydown="$event.key === 'Enter' && accept.click()" @submit.prevent="handleSubmit">
        <div class="form-control">
          <label for="name" class="form-label">
            <span class="label-text">Name</span>
          </label>
          <input name="name" type="text" class="input input-bordered" v-model="purchase.name" />
        </div>
        <div class="form-control">
          <label for="price" class="form-label">
            <span class="label-text">Price</span>
          </label>
          <label class="input-group">
            <input
              min="1"
              step="any"
              name="price"
              type="number"
              class="input input-bordered"
              v-model.number="purchase.price"
            />
            <span>€</span>
          </label>
        </div>
        <div class="modal-action">
          <label ref="accept" for="create-purchase-modal" class="btn btn-primary" @click="handleSubmit">Create</label>
          <label for="create-purchase-modal" class="btn">Close</label>
        </div>
      </form>
    </div>
  </div>
</template>
