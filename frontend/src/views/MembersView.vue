<script setup lang="ts">
import MembersComponent from '@/components/MembersComponent.vue'
import { useFlat } from '@/composables/useFlat'
import { watchEffect } from 'vue'

const { flat } = useFlat()

watchEffect(() =>
  flat.value?.members.forEach((member) => {
    console.log(member.firstName)
  }),
)
</script>

<template>
  <div class="-space-x-5 avatar-group">
    <MembersComponent v-if="flat" :members="flat.members" />
  </div>
</template>
