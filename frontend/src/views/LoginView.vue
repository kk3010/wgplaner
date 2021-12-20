<script setup lang="ts">
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUser } from '@/composables/useUser'
import { useRouter } from 'vue-router'

const { user } = useUser()
const { login } = useAuth(user)
const { push } = useRouter()

const formUser = reactive({
  email: '',
  password: '',
})
async function handleLogin() {
  await login(formUser.email, formUser.password)
  await push('/flat')
}
</script>

<template>
  <div class="card text-center shadow-2xl">
    <div class="card-body">
      <h2 class="card-title uppercase">Login</h2>
      <!-- .prevent hinders page reloading -->
      <form @submit.prevent="handleLogin">
        <div class="form-control">
          <input
            class="input input-bordered input-accent mb-4"
            v-model="formUser.email"
            name="email"
            placeholder="email"
            type="email"
          />
        </div>
        <div class="form-control">
          <input
            class="input input-bordered input-accent mb-4"
            v-model="formUser.password"
            name="password"
            placeholder="password"
            type="password"
          />
        </div>
        <div class="justify-end card-actions">
          <button class="btn btn-outline" type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
