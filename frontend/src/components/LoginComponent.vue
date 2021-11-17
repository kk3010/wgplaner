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
  <form class="form-control max-w-xs" @submit.prevent="handleLogin">
    <input class="mb-4" v-model="user.email" name="email" type="email" />
    <input v-model="user.password" name="password" type="password" />
    <button type="submit">Login</button>
  </form>
</template>
