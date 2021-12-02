<script setup lang="ts">
import { reactive } from 'vue'
import { useAuth, RegisterRequest } from '@/composables/useAuth'
import { useUser } from '@/composables/useUser'
import { useRouter } from 'vue-router'

const { user } = useUser()
const { register } = useAuth(user)
const { push } = useRouter()

const formUser = reactive<RegisterRequest>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

async function handleRegistration() {
  await register(formUser)
  await push('/flat')
}
</script>

<template>
  <div class="card text-center shadow-2xl">
    <div class="card-body">
      <h2 class="card-title uppercase">Create a new account</h2>
      <form @submit.prevent="handleRegistration">
        <div class="form-control">
          <input
            class="input input-bordered input-accent mb-4"
            v-model="formUser.firstName"
            name="firstName"
            placeholder="first name"
            type="text"
          />
        </div>
        <div class="form-control">
          <input
            class="input input-bordered input-accent mb-4"
            v-model="formUser.lastName"
            name="lastName"
            placeholder="last name"
            type="text"
          />
        </div>
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
            minlength="8"
          />
        </div>
        <div class="mb-4">
          <span
            >I already have an account. Go to
            <router-link to="/login" class="font-semibold text-green-500">LOGIN</router-link>.</span
          >
        </div>
        <div class="justify-end card-actions">
          <button class="btn btn-outline" type="submit">Sign up</button>
        </div>
      </form>
    </div>
  </div>
</template>
