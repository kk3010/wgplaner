<script setup lang="ts">
function handleCreate() {}
</script>

<template>
  <h2 class="card-title">Create a new flat for your not existing friends.</h2>
  <p>You silly bloody wanker</p>
  <form class="mt-4" @submit.prevent="handleCreate">
    <div class="form-control">
      <input class="input input-bordered input-accent mt-4" name="flatName" placeholder="Give it a name" type="text" />
    </div>
    <div class="justify-center card-actions">
      <button class="btn btn-lg btn-outline btn-accent">Create</button>
    </div>
  </form>
</template>
