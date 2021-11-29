<script setup lang="ts">
import { reactive } from 'vue'
import axios from 'axios'

const user = reactive({
  email: '',
  password: '',
})
function handleLogin() {
  axios.post('/auth/login', user)
}
</script>

<template>
  <div class="form-control">
    <span class="m-4 ml-0 text-sm font-semibold uppercase label-text"> Login </span>
    <form @submit.prevent="handleLogin">
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
      <div class="form-control">
        <button class="btn btn-square btn-outline p-4" type="submit">Login</button>
      </div>
    </form>
  </div>
</template>
