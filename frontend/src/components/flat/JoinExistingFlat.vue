<script setup lang="ts">
import { ref } from 'vue'
import { useFlat } from '@/composables/useFlat'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'

const err = ref<string>()
const token = ref<string>()
const { joinFlat } = useFlat()
const { push } = useRouter()
const { getUser } = useUser()

async function handleJoin() {
  if (!token.value) {
    return
  }
  try {
    await joinFlat(token.value)
    await getUser()
    await push('/')
  } catch (e) {
    err.value = 'Wrong token string. Please enter the correct one'
  }
}
</script>

<template>
  <h2 class="card-title">Join an existing one.</h2>
  <p>Honestly, who you're lying to? You don't have any friends. Go outside and meet real people</p>
  <div class="flex-grow"></div>
  <form class="mt-4 flex-none" @submit.prevent="handleJoin">
    <div class="form-control">
      <input
        class="input input-bordered input-accent mt-4"
        v-model="token"
        name="invitationToken"
        placeholder="Paste your invitation token"
        type="text"
      />
    </div>
    <p class="text-red-400 mt-4" v-if="err">{{ err }}</p>
    <div class="justify-center card-actions">
      <button class="btn btn-lg btn-outline btn-accent" type="submit">Join</button>
    </div>
  </form>
</template>
