<script setup lang="ts">
</script>

<template>
  <div class="drawer">
    <div class="drawer-side">
      <!-- <label for="my-drawer" class="drawer-overlay"></label> -->
      <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
        <li>
          <router-link to="/Putzplan">
            Putzdienste
          </router-link>
        </li>
        <li>
          <router-link to="/Einkaufsliste">
            Einkaufsliste
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
