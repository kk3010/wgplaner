<script lang="ts" setup>
import { useToggle, onClickOutside } from '@vueuse/core'
import { MenuIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'

const target = ref()
const [shown, toggle] = useToggle(false)

onClickOutside(target, () => toggle(false))
</script>

<template>
  <div class="fixed bottom-4 right-4 md:bottom-8 md:right-8 lg:bottom-16 lg:right-16" ref="target">
    <transition name="fab-buttons">
      <div v-show="shown" class="flex flex-col items-center mb-2 origin-bottom">
        <slot></slot>
      </div>
    </transition>
    <button class="btn btn-lg btn-circle btn-primary text-3xl" @click="toggle()">
      <MenuIcon class="h-8 w-8" />
    </button>
  </div>
</template>

<style>
.fab-buttons-enter-active,
.fab-buttons-leave-active {
  @apply transition;
}

.fab-buttons-enter-from,
.fab-buttons-leave-to {
  @apply opacity-0 scale-90 translate-y-4;
}
</style>
