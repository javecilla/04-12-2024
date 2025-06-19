<template>
  <div class="container mx-auto py-8 px-4">
    <div class="w-full max-w-3xl mx-auto content-center mb-12">
      <h1 class="album-main-title poppins-bold-italic text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
        Gunita sa araw na ako'y naging sa iyo.
      </h1>
      <p class="album-sub-title text-xl text-gray-600 dark:text-gray-300">
        04122024
      </p>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading the albums...</p>
    </div>

    <!-- Perfect Grid Layout -->
    <div v-else class="album-grid">
      <AlbumCard v-for="album in randomizedAlbums" :key="album.id" :album="album" @click="goToAlbum(album)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGalleryStore } from '../stores/gallery';
import AlbumCard from './AlbumCard.vue';

const router = useRouter();
const galleryStore = useGalleryStore();
const shuffledAlbums = ref<any[]>([]);
const isLoading = ref(true);

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Computed property that returns all randomized albums
const randomizedAlbums = computed(() => {
  return shuffledAlbums.value.length > 0 ? shuffledAlbums.value : galleryStore.albums;
});

onMounted(async () => {
  // Simulate loading time to show the loading state
  setTimeout(() => {
    shuffledAlbums.value = shuffleArray(galleryStore.albums);
    isLoading.value = false;
  }, 800); // Added a small delay to show loading state
});

function goToAlbum(album: any) {
  router.push({ name: 'AlbumPhotos', params: { albumId: album.id } });
}
</script>

<style scoped>
.album-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 1rem;
}

.album-main-title {
  font-size: 2.5rem;
}

.album-sub-title {
  font-size: 1.25rem;
  color: #6b7280;
  /* Tailwind gray-600 */
  margin-top: -20px;
}

/* Loading state styles */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
  gap: 1rem;
}

.loading-text {
  font-size: 1.125rem;
  color: #666;
  font-weight: 500;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Dark mode support for loading state */
@media (prefers-color-scheme: dark) {
  .loading-text {
    color: #999;
  }

  .loading-spinner {
    border-color: #333;
    border-top-color: #ffffff;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 600px;
  }
}

@media (max-width: 480px) {
  .album-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    max-width: 300px;
  }
}
</style>