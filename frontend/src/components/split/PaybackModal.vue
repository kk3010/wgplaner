<script lang="ts" setup>
import { computed, ref } from 'vue'

defineEmits<{
  (event: 'submit', amount: number): void
}>()

const amount = ref(0)

const submitEnabled = computed(() => amount.value > 0)
</script>

<template>
  <div class="modal">
    <div class="modal-box max-h-screen overflow-auto">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Amount</span>
        </label>
        <label class="input-group">
          <input min="0" type="number" class="input input-bordered w-full" v-model.number="amount" />
          <span>€</span>
        </label>
      </div>
      <div class="modal-action flex justify-start">
        <label
          ref="accept"
          for="payback-modal"
          class="btn"
          :class="[submitEnabled ? 'btn-primary' : 'btn-disabled pointer-events-none']"
          :aria-disabled="!submitEnabled"
          @click="$emit('submit', amount)"
          >Pay back</label
        >
        <label for="payback-modal" class="btn">Close</label>
      </div>
    </div>
  </div>
</template>
