<script lang="ts" setup>
import { onMounted } from 'vue'
import { themeChange } from 'theme-change'
import { ChevronDownIcon } from '@heroicons/vue/outline'

const themes = ['light', 'dark', 'black', 'bumblebee', 'cmyk', 'emerald', 'fantasy', 'forest', 'halloween']

onMounted(() => {
  themeChange(false)
})
</script>

<template>
  <div title="Change theme" class="dropdown">
    <button class="m-1 btn btn-ghost normal-case collapse-arrow">Theme <ChevronDownIcon class="w-4 h-4 ml-2" /></button>
    <ul
      tabindex="0"
      class="
        mt-16
        p-2
        top-px
        overflow-y-auto
        shadow
        menu
        compact
        h-72
        dropdown-content
        bg-base-100
        text-base-content
        rounded-box
      "
    >
      <li v-for="theme in themes" :key="theme">
        <a tabindex="0" :data-set-theme="theme" data-act-class="active">
          {{ theme }}
        </a>
      </li>
    </ul>
  </div>
</template>
