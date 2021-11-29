<script lang="ts" setup>
import { onMounted } from 'vue'
import { themeChange } from 'theme-change'

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
].sort()

onMounted(() => {
  themeChange(false)
})
</script>

<template>
  <div title="Theme ändern" class="dropdown dropdown-end">
    <button class="m-1 btn btn-ghost normal-case">Theme</button>
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
