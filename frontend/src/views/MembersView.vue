<script setup lang="ts">
import MembersComponent from '@/components/MembersComponent.vue'
import { useFlat } from '@/composables/useFlat'
import { watchEffect } from 'vue'
import InvitationToken from '@/components/flat/InvitationToken.vue'

const { flat } = useFlat()

watchEffect(() =>
  flat.value?.members.forEach((member) => {
    console.log(member.firstName)
  }),
)
</script>

<template>
  <div class="flex flex-col">
    <label class="label">
      <span class="label-text font-bold text-xl">Manage members</span>
    </label>
    <div class="flex flex-col lg:flex-row p-6">
      <MembersComponent v-if="flat" :members="flat.members" />
    </div>
    <label class="label">
      <span class="label-text font-bold text-xl">Share an invitation token</span>
    </label>
    <div class="stats shadow p-6">
      <InvitationToken />
    </div>
  </div>
</template>
