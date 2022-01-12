<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'

const { flat } = useFlat()
</script>
<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text font-bold text-xl">Share an invitation token</span>
    </label>
    <div class="relative w-full lg:w-1/2">
      <p class="pr-16 stat place-content-center input input-primary input-bordered">{{ flat?.invitationToken }}</p>
      <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">Copy</button>
    </div>
  </div>
</template>
