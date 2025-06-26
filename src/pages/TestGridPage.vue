<template>
  <div class="test-page">
    <h1>Image Test Page</h1>
    <div class="test-grid">
      <div v-for="album in albums" :key="album.id" class="test-card">
        <h3>{{ album.title }}</h3>
        <img 
          :src="album.cover" 
          :alt="album.title"
          @load="onImageLoad(album.title)"
          @error="onImageError(album.title, album.cover)"
          style="width: 200px; height: 200px; object-fit: cover;"
        />
        <p>{{ album.cover }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useGalleryStore } from '../stores/gallery';

const galleryStore = useGalleryStore();
const albums = ref<any[]>([]);

function onImageLoad(title: string) {
  console.log('✅ Image loaded successfully:', title);
}

function onImageError(title: string, src: string) {
  console.error('❌ Image failed to load:', title, src);
}

onMounted(() => {
  albums.value = galleryStore.albums.slice(0, 3); // Test with first 3 albums
  console.log('Test albums:', albums.value);
});
</script>

<style scoped>
.test-page {
  padding: 2rem;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.test-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.test-card h3 {
  margin-bottom: 1rem;
}

.test-card p {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #666;
  word-break: break-all;
}
</style>