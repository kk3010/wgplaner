<script setup lang="ts">
function handleJoin() {}
</script>

<template>
  <h2 class="card-title">Join an existing one.</h2>
  <p>Honestly, who you're lying to? You don't have any friends. You are still a silly bloody wanker</p>
  <div class="flex-grow"></div>
  <form class="mt-4 flex-none" @submit.prevent="handleJoin">
    <div class="form-control">
      <input
        class="input input-bordered input-accent mt-4"
        name="url"
        placeholder="Paste your invitation link"
        type="url"
      />
    </div>
    <div class="justify-center card-actions">
      <button class="btn btn-lg btn-outline btn-accent" type="submit">Join</button>
    </div>
  </form>
</template>
