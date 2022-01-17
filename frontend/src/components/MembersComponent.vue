<script setup lang="ts">
import type { IUser } from '@interfaces/user.interface'
import UserAvatar from './user/UserAvatar.vue'
import { TrashIcon } from '@heroicons/vue/outline'
import { useFlat } from '@/composables/useFlat'
import { useUser } from '@/composables/useUser'
import { useRouter } from 'vue-router'

const props = defineProps<{
  member: IUser
}>()

const { removeUser } = useFlat()
const { user } = useUser()
const { push } = useRouter()

const handleDeleteMember = async () => {
  const id = props.member.id
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
  <div class="flex gap-4 items-center justify-between max-w-xs rounded-box p-4 shadow-md">
    <UserAvatar :user="member" class="!h-20 !w-20" />
    <p class="font-bold text-base">{{ member.firstName }} {{ member.lastName }}</p>
    <button class="h-5 btn btn-circle btn-accent btn-error" title="Remove member" @click="handleDeleteMember">
      <TrashIcon class="h-4 w-4" />
    </button>
  </div>
</template>
