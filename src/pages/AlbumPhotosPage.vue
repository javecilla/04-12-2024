<template>
  <div class="min-h-screen bg-white dark:bg-[#2c2c2c]">
    <div class="container mx-auto py-8 px-4">
      <div class="header-container mb-8">
        <h1 class="page-title text-2xl font-bold text-gray-900 dark:text-white">{{ album?.title }}</h1>
        <p class="page-description">{{  album?.description }}</p>
      </div>
      <MasonryGallery :photos="photos" />

      <!-- Floating back button -->
      <button @click="goBack" class="floating-back-button" aria-label="Back to albums">
        <ArrowLeftCircle class="w-10 h-10" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { useGalleryStore } from '../stores/gallery';
import MasonryGallery from '../components/MasonryGallery.vue';
import { ArrowLeftCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const galleryStore = useGalleryStore();

const albumId = computed(() => route.params.albumId as string);
const album = computed(() => galleryStore.getAlbumById(albumId.value));
const photos = computed(() => galleryStore.getPhotosByAlbumId(albumId.value));

function goBack() {
  router.push({ name: 'Home' });
}

const defaultTitle = '04122024';

onMounted(() => {
  if (album.value?.title) {
    document.title = album.value.title + ' | ' + defaultTitle;
  }
});

watch(album, (newAlbum) => {
  if (newAlbum?.title) {
    document.title = newAlbum.title + ' | ' + defaultTitle;
  } else {
    document.title = defaultTitle;
  }
});

onUnmounted(() => {
  document.title = defaultTitle;
});
</script>

<style scoped>
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.page-title {
  margin: 0;
}

.page-description {
  max-width: 700px;
}

.floating-back-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #fb5835;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  opacity: 0.9;
}

.floating-back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  opacity: 1;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .floating-back-button {
    background-color: #3a3a3a;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .floating-back-button:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .floating-back-button {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>