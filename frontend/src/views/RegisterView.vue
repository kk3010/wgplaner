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
  <div class="card text-center flex-grow m-10 shadow-2xl p-12">
    <div class="card-body">
      <h2 class="card-title uppercase">Create a new account</h2>
      <form @submit.prevent="handleRegistration">
        <div class="form-control">
          <input
            class="input input-bordered input-accent mb-4"
            v-model="user.firstname"
            name="firstname"
            placeholder="firstname"
            type="text"
          />
        </div>
        <div class="form-control">
          <input
            class="input input-bordered input-accent mb-4"
            v-model="user.lastname"
            name="lastname"
            placeholder="lastname"
            type="text"
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
