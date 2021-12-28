<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUser } from '@/composables/useUser'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'

const { user } = useUser()
const { login } = useAuth(user)
const { push } = useRouter()

const formUser = reactive({
  email: '',
  password: '',
})

const error = ref()

async function handleLogin() {
  try {
    await login(formUser.email, formUser.password)
    await push('/flat')
  } catch (e) {
    error.value = (e as AxiosError)?.response?.status === 401 ? 'Wrong Credentials' : 'Something went wrong'
  }
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
        <div class="text-error mb-2" v-if="error">
          {{ error }}
        </div>
        <div>
          <span>
            No account yet? Go to
            <router-link to="/register" class="font-semibold link-accent">REGISTER</router-link>
          </span>
        </div>
        <div class="justify-end card-actions">
          <button class="btn btn-outline" type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
