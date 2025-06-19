<!-- AlbumListPage.vue - Album listing page -->
<template>
  <div class="min-h-screen bg-white dark:bg-[#2c2c2c]">
    <AlbumList />
  </div>
</template>

<script lang="ts" setup>
import AlbumList from '../components/AlbumList.vue';
</script>

<style scoped>
/* Ensure flexbox behavior */
.flex {
  display: flex !important;
}

.items-center {
  align-items: center !important;
}
</style>