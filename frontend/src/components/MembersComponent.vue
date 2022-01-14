<script setup lang="ts">
import type { IUser } from '@interfaces/user.interface'
import UserAvatar from './user/UserAvatar.vue'
import { TrashIcon } from '@heroicons/vue/outline'
import { useFlat } from '@/composables/useFlat'
import { useUser } from '@/composables/useUser'
import { useRouter } from 'vue-router'

defineProps<{
  members: IUser[]
}>()
const { removeUser } = useFlat()
const { user } = useUser()
const { push } = useRouter()

const handleDeleteMember = async (id: number) => {
  if (window.confirm('Are you sure you want to remove this user from the flat?')) {
    await removeUser(id)
    if (id == user.value!.id) {
      user.value!.flatId = null
      await push('/auth')
    }
  }
}
</script>

<template>
  <div v-for="member in members" :key="member.id" class="flex flex-row xs:flex-col text-center shadow-md m-2">
    <UserAvatar :user="member" class="m-1 !h-20 !w-20" />
    <p class="items-center text-base">{{ member.firstName }} {{ member.lastName }}</p>
    <div class="flex-grow"></div>
    <div class="xs:justify-end">
      <button
        class="h-5 btn btn-circle btn-accent btn-error"
        title="Remove member"
        @click="handleDeleteMember(member.id)"
      >
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
