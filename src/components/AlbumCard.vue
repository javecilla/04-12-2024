<template>
  <template v-if="album.category === 'specific'">
    <div class="album-card specific" @click="$emit('click')">
      <span v-if="album.date" class="album-label specific">{{ album.date }}</span>
      <div class="album-image-container specific">
        <SkeletonLoader v-if="isLoading" />
        <img :src="album.cover" :alt="album.title" class="album-image" loading="lazy" @load="onImageLoaded" @error="onImageError" />
      </div>
      <div class="album-info specific">
        <span class="album-subtitle specific">{{ album.subtitle }}</span>
        <h3 class="poppins-semibold album-title specific">{{ album.title }}</h3>
        <p class="poppins-regular album-description specific" v-if="album.description">{{ album.description }}</p>
      </div>
    </div>
  </template>
  <template v-if="album.category === 'favorite'">
    <div class="album-card favorite" @click="$emit('click')">
      <span v-if="album.date" class="album-label favorite">{{ album.date }}</span>
      <div class="album-info favorite">
        <h3 class="poppins-regular album-title favorite">{{ album.title }}</h3>
        <p class="poppins-regular album-description favorite" v-if="album.description">{{ album.description }}</p>
        <span class="album-subtitle favorite">{{ album.subtitle }}</span>
      </div>
      <div class="album-image-container favorite">
        <SkeletonLoader v-if="isLoading" />
        <img :src="album.cover" :alt="album.title" class="album-image" loading="lazy" @load="onImageLoaded" @error="onImageError" />
      </div>
    </div>
  </template>
  <template v-if="album.category === 'general'">
    <div class="album-card general" @click="$emit('click')">
      <div class="album-image-container general">
        <SkeletonLoader v-if="isLoading" />
        <img :src="album.cover" :alt="album.title" class="album-image general" loading="lazy" @load="onImageLoaded" @error="onImageError" />
      </div>
      <div class="album-info general">
        <span class="album-subtitle general">{{ album.subtitle }}</span>
        <p class="poppins-regular album-description general" v-if="album.description">{{ album.description }}</p>
      </div>
    </div>
  </template>
  <template v-if="album.category === 'nostalgic'">
    <div class="album-card nostalgic" @click="$emit('click')">
      <div class="album-info nostalgic">
        <h3 class="poppins-regular album-title nostalgic">{{ album.title }}</h3>
        <p class="poppins-regular album-description nostalgic" v-if="album.description">{{ album.description }}</p>
      </div>
      <div class="album-image-container nostalgic">
        <SkeletonLoader v-if="isLoading" />
        <img :src="album.cover" :alt="album.title" class="album-image" loading="lazy" @load="onImageLoaded" @error="onImageError" />
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import SkeletonLoader from './SkeletonLoader.vue';
import 'aos/dist/aos.css';

// Define the Album interface to match your store
interface Album {
  id: string;
  category: string;
  date?: string;
  title: string;
  subtitle?: string;
  cover: string;
  description?: string;
}

const props = defineProps<{
  album: Album;
}>();

// Emit events
const emit = defineEmits<{
  click: [];
  'image-loaded': [];
}>();

const isLoading = ref(true);

function onImageLoaded() {
  isLoading.value = false;
  emit('image-loaded'); // Let parent know image has loaded
}

function onImageError() {
  isLoading.value = false;
  console.warn(`Failed to load image: ${props.album.cover}`);
  emit('image-loaded'); // Still emit to prevent layout from waiting indefinitely
}

onMounted(() => {
  // Parent component (AlbumList) handles AOS initialization.
});
</script>

<style scoped>
.album-card {
  border-radius: 1.5rem;
  /* 16px */
  padding: 1rem;
  /* 16px */
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.album-card.specific {
  background-color: #1c1c1e;
}
.album-card.favorite {
  background-color: transparent;
}
.album-card.nostalgic {
  background-color: transparent;
}

.album-card.specific:hover {
  padding: 1.02rem;
  border-radius: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  color: #f3f3f3;
}
.album-card.favorite:hover {
  background-color: #1c1c1e;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  color: #f3f3f3;
}
.album-card.nostalgic:hover {
  background-color: #1c1c1e;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  color: #f3f3f3;
}
.album-card.general:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.album-label {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #f3f3f3;
}

.album-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  /* 8px */
  overflow: hidden;
  background-color: #2c2c2e;
}
.album-image-container.specific {
  aspect-ratio: 1; /* Make it a square */
}
.album-image-container.favorite {
  aspect-ratio: 1;
}
.album-image-container.nostalgic {
  background-color: transparent!important;
}

.album-image-container.general {
  /* make it rectangle */
  aspect-ratio: 4 / 3!important;
}

.album-image {
  width: 100%;
  height: 100%; /* Fill the container */
  object-fit: cover; /* Cover the area, crop if needed */
  display: block;
}

.album-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.album-subtitle {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: #b0b0b0;
}

.album-title {
  margin: 0;
}
.album-title.specific {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
}
.album-title.favorite {
  font-size: 2.5rem;
  line-height: 1;
}
.album-title.nostalgic {
  font-size: 2.5rem;
  line-height: 1;
}

.album-description {
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 10px 0 0 0;
}

.album-description.favorite {
  text-transform: uppercase;
}

.album-image-container .skeleton-loader {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>