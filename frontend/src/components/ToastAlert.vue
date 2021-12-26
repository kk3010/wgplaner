<script lang="ts" setup>
import { useToast } from '@/composables/useToast'
import { InformationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/vue/outline'

const { toasts } = useToast()
</script>

<template>
  <teleport to="body">
    <div class="absolute flex flex-col space-y-2 p-2 top-10 right-2 sm:right-4 md:right-8 max-w-xs">
      <transition-group name="toasts">
        <div v-for="toast in toasts" :key="toast.id" class="bg-base-100 transition rounded-box">
          <div
            class="alert"
            :class="{
              'alert-info': toast.type === 'info',
              'alert-success': toast.type === 'success',
              'alert-error': toast.type === 'error',
            }"
          >
            <div class="flex-1">
              <InformationCircleIcon v-if="toast.type === 'info'" class="w-6 h-6 mx-2" />
              <CheckCircleIcon v-else-if="toast.type === 'success'" class="w-6 h-6 mx-2" />
              <XCircleIcon v-else-if="toast.type === 'error'" class="w-6 h-6 mx-2" />
              <span>{{ toast.message }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style>
.toasts-enter-from,
.toasts-leave-to {
  @apply opacity-0;
}

.toasts-enter-active {
  @apply ease-out;
}

.toasts-leave-active {
  @apply ease-in;
}
</style>
