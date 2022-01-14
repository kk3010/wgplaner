<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '../composables/useUser'
import UserAvatar from '@/components/user/UserAvatar.vue'

const { user, updateUser, deleteUser } = useUser()
const { removeUser } = useFlat()
const { push } = useRouter()

const handleLeaveFlat = () => {
  if (window.confirm('Are you sure you want to leave the flat?')) {
    removeUser(user.value!.id)
    push('/')
  }
}

const handleDeleteUser = () => {
  if (window.confirm('Are you sure you want to delete your account?')) {
    deleteUser()
    push('/')
  }
}

const userState = reactive({
  ...user.value!,
})
</script>

<template>
  <div class="px-2 py-6 flex flex-col justify-center w-full max-w-sm mx-auto">
    <h1 class="text-3xl font-black mb-10 text-center">Profile Settings</h1>
    <div class="flex flex-col items-center space-y-4">
      <UserAvatar class="!w-20 !h-20" :user="userState" />
      <div class="relative flex flex-col space-y-2 items-center">
        <label for="color" class="btn btn-outline btn-xs"> Change Color </label>
        <input
          type="color"
          id="color"
          class="absolute top-0 left-0 invisible opacity-0"
          v-model="userState.color"
          @change="updateUser({ color: userState.color })"
        />
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text mr-2 w-12">Dark</span>
            <input
              type="checkbox"
              checked="checked"
              v-model="userState.textWhite"
              class="toggle block"
              @change="updateUser({ textWhite: userState.textWhite })"
            />
            <span class="label-text ml-2 w-12">Light</span>
          </label>
        </div>
      </div>
      <form @submit.prevent="updateUser({ firstName: userState.firstName })">
        <div class="form-control">
          <label class="label" for="firstName">
            <span class="label-text">First Name</span>
          </label>
          <div class="relative">
            <input id="firstName" type="text" v-model="userState.firstName" class="w-full pr-16 input input-bordered" />
            <button type="submit" class="absolute top-0 right-0 rounded-l-none btn btn-dark">Change</button>
          </div>
        </div>
      </form>
      <form @submit.prevent="updateUser({ lastName: userState.lastName })">
        <div class="form-control">
          <label class="label" for="lastName">
            <span class="label-text">Last Name</span>
          </label>
          <div class="relative">
            <input id="lastName" type="text" v-model="userState.lastName" class="w-full pr-16 input input-bordered" />
            <button type="submit" class="absolute top-0 right-0 rounded-l-none btn btn-dark">Change</button>
          </div>
        </div>
      </form>
      <form @submit.prevent="updateUser({ firstName: userState.firstName })">
        <div class="form-control">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <div class="relative">
            <input id="email" type="email" v-model="userState.email" class="w-full pr-16 input input-bordered" />
            <button type="submit" class="absolute top-0 right-0 rounded-l-none btn btn-dark">Change</button>
          </div>
        </div>
      </form>
    </div>
    <div class="mt-20 space-y-4">
      <div class="divider my-10">
        <h2 class="text-xl">Danger Zone</h2>
      </div>
      <button @click="handleLeaveFlat" class="rounded block btn-sm btn btn-outline btn-error mx-auto">
        Leave flat
      </button>
      <button @click="handleDeleteUser" class="rounded block btn-sm btn btn-outline btn-error mx-auto">
        Delete User
      </button>
    </div>
  </div>
</template>
