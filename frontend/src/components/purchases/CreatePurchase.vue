<script lang="ts" setup>
import { computed, reactive, ref, toRefs } from 'vue'
import type { CreatePurchase } from '@/composables/usePurchases'
import type { IUser } from '@interfaces/user.interface'
import MembersTable from '../flat/MembersTable.vue'

const props = defineProps<{
  members: IUser[]
  shoppingItems: number[]
}>()

const emit = defineEmits<{
  (event: 'create', data: CreatePurchase): void
}>()

const accept = ref()

const { shoppingItems } = toRefs(props)

const payers = ref<number[]>(props.members.map((u) => u.id))

const purchase = reactive({
  name: '',
  payers,
  shoppingItems,
  price: 1,
})

const handleSubmit = () => {
  emit('create', purchase)
}

const submitEnabled = computed(() => payers.value.length > 0)
</script>

<template>
  <div class="modal">
    <div class="modal-box max-h-screen overflow-auto">
      <form class="space-y-4" @keydown="$event.key === 'Enter' && submitEnabled && accept.click()">
        <div class="form-control">
          <label for="name" class="form-label">
            <span class="label-text">Name</span>
          </label>
          <input id="name" name="name" type="text" class="input input-bordered" v-model="purchase.name" />
        </div>
        <div class="form-control">
          <label for="price" class="form-label">
            <span class="label-text">Price</span>
          </label>
          <label class="input-group">
            <input
              min="0"
              step="any"
              name="price"
              id="price"
              type="number"
              class="input input-bordered"
              v-model.number="purchase.price"
            />
            <span>€</span>
          </label>
        </div>
        <div class="form-control">
          <label for="payers" class="form-label">
            <span class="label-text">Payers</span>
          </label>
          <MembersTable class="w-full" id="payers" :members="members" v-model="payers" />
        </div>
        <div class="modal-action">
          <label
            ref="accept"
            for="create-purchase-modal"
            class="btn"
            :class="[submitEnabled ? 'btn-primary' : 'btn-disabled pointer-events-none']"
            :aria-disabled="!submitEnabled"
            @click="handleSubmit"
            >Create</label
          >
          <label for="create-purchase-modal" class="btn">Close</label>
        </div>
      </form>
    </div>
  </div>
</template>
