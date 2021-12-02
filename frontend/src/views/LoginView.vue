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
  <div class="card text-center shadow-2xl">
    <div class="card-body">
      <h2 class="card-title uppercase">Login</h2>
      <!-- .prevent hinders page reloading -->
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
