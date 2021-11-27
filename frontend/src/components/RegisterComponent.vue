<script setup lang="ts">
import { reactive } from 'vue'
import axios from 'axios'

const user = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
})
function handleRegistration() {
  axios.post('/auth/register', user)
}
</script>

<template>
  <div class="form-control max-w-xs">
    <span class="m-4 ml-0 text-sm font-semibold uppercase label-text"> Create a new account </span>
    <form @submit.prevent="handleRegistration">
      <div class="form-control">
        <input
          class="input input-bordered input-accent mb-4"
          v-model="user.firstname"
          name="email"
          placeholder="firstname"
          type="email"
        />
      </div>
      <div class="form-control">
        <input
          class="input input-bordered input-accent mb-4"
          v-model="user.lastname"
          name="email"
          placeholder="lastname"
          type="email"
        />
      </div>
      <div class="form-control">
        <input
          class="input input-bordered input-accent mb-4"
          v-model="user.email"
          name="email"
          placeholder="email"
          type="email"
        />
      </div>
      <div class="form-control">
        <input
          class="input input-bordered input-accent mb-4"
          v-model="user.password"
          name="password"
          placeholder="password"
          type="password"
        />
      </div>
      <div class="mb-4">
        <span>I've already have an account. Go to <router-link to="/login" class="font-semibold text-green-500">LOGIN</router-link>.</span>
      </div>
      <div class="flex items-end form-control">
        <button class="btn btn-square btn-outline p-4" type="submit">Sign up</button>
      </div>
    </form>
  </div>
</template>
