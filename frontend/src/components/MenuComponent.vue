<script setup lang="ts">
import ThemeDropdown from './ThemeDropdown.vue'
import { MenuIcon } from '@heroicons/vue/outline'
import { useUser } from '@/composables/useUser'
import { useAuth } from '@/composables/useAuth'
import UserAvatar from './user/UserAvatar.vue'
import { LogoutIcon } from '@heroicons/vue/outline'
import { UserIcon } from '@heroicons/vue/outline'

const { user } = useUser()
const { logout } = useAuth(user)

const confirmLogout = async () => {
  if (window.confirm('Are you sure you want to logout?')) {
    await logout()
  }
}
</script>

<template>
  <div
    class="
      inset-x-0
      top-0
      sticky
      z-50
      border-b border-base-200
      shadow-lg
      bg-neutral
      text-neutral-content
      md:rounded-box
    "
  >
    <div class="navbar">
      <div class="flex-none lg:hidden">
        <label class="btn btn-square btn-ghost" for="my-drawer">
          <MenuIcon class="w-6 h-6" />
        </label>
      </div>

      <div class="flex-1">
        <ThemeDropdown />
      </div>

      <!-- user avatar -->
      <div class="flex-none dropdown dropdown-end">
        <button class="btn btn-square btn-ghost rounded" v-if="user">
          <UserAvatar :user="user" />
        </button>
        <ul
          class="
            mt-16
            p-2
            top-px
            overflow-y-auto
            shadow
            menu
            compact
            dropdown-content
            bg-base-100
            text-base-content
            rounded-box
            font-semibold
          "
        >
          <li>
            <router-link to="/profile" active-class="active"> <UserIcon class="w-4 h-4 mr-1" /> Profile</router-link>
          </li>
          <li @click="confirmLogout">
            <router-link to=""><LogoutIcon class="w-4 h-4 mr-2" /> Logout </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
