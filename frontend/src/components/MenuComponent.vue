<script setup lang="ts">
import ThemeDropdown from './ThemeDropdown.vue'
import { MenuIcon } from '@heroicons/vue/outline'
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
      <div class="flex-none">
        <div class="avatar">
          <div class="rounded-full w-10 h-10 m-1">
            <img src="https://i.pravatar.cc/500?img=32" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
