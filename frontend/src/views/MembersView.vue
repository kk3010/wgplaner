<script setup lang="ts">
import MembersComponent from '@/components/MembersComponent.vue'
import { useFlat } from '@/composables/useFlat'
import InvitationToken from '@/components/flat/InvitationToken.vue'
import RenameFlat from '@/components/flat/RenameFlat.vue'

const { flat, deleteFlat } = useFlat()

async function handleDeletion() {
  if (window.confirm('Are you sure you want to delete the flat? This cannot be undone.')) {
    await deleteFlat()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="label">
      <span class="label-text font-bold text-xl">Manage flat</span>
    </label>
    <div class="rounded-box shadow p-6">
      <RenameFlat v-if="flat" :flatName="flat.name" />
    </div>
    <label class="label">
      <span class="label-text font-bold text-xl">Manage members</span>
    </label>
    <div v-if="flat" class="flex flex-wrap gap-4">
      <MembersComponent v-for="member in flat.members" :key="member.id" class="flex-1" :member="member" />
    </div>
    <label class="label">
      <span class="label-text font-bold text-xl">Share invitation token</span>
    </label>
    <div class="rounded-box shadow p-6">
      <InvitationToken />
    </div>
    <div class="divider mt-12 mb-4">
      <h2 class="text-xl">Danger Zone</h2>
    </div>
    <button @click="handleDeletion" class="rounded block btn-sm btn btn-outline btn-error mx-auto">delete flat</button>
  </div>
</template>
