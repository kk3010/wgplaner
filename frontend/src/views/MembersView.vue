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
  <div>
    <MembersComponent v-if="flat" :members="flat.members" />
    <InvitationToken />
  </div>
</template>
