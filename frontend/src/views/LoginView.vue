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
  <div class="card text-center flex-grow m-10 shadow-2xl p-12">
    <div class="card-body">
      <h2 class="card-title uppercase">Login</h2>
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
        <div class="justify-end card-actions">
          <button class="btn btn-outline" type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
