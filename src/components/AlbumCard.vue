<template>
  <div class="album-card heart-cursor" @click="$emit('click')">
    <div class="album-content">
      <SkeletonLoader v-if="isLoading" />
      <img :src="album.cover" :alt="album.title" class="album-image" loading="lazy" @load="onImageLoaded" @error="onImageError" data-aos="fade-up" data-aos-duration="300" data-aos-delay="10" data-aos-offset="20" data-aos-once="false" />
      <div class="overlay" v-show="!isLoading">
        <div class="album-info">
          <h2 class="album-title text-lg font-semibold text-white mb-1">{{ album.title }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import SkeletonLoader from './SkeletonLoader.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

defineProps<{ album: { id: string; title: string; cover: string; description?: string } }>();

const isLoading = ref(true);

function onImageLoaded() {
  isLoading.value = false;
  // Refresh AOS after masonry layout updates
  AOS.refresh();
}

function onImageError() {
  isLoading.value = false;
  // You could set a fallback image here if needed
}

onMounted(() => {
  // Initialize AOS for animations
  AOS.init({
    once: true,
    mirror: false,
    startEvent: 'load',
    offset: 150,
    duration: 1000,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    anchorPlacement: 'bottom-bottom'
  });
});
</script>

<style scoped>
.album-card {
  aspect-ratio: 1;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  cursor: pointer;
}

.album-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.album-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.album-title {
  text-align: left !important;
  margin-bottom: 3px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

/* Hover effects */
.album-card:hover .album-image {
  transform: scale(1.1);
}

.album-card:hover .overlay {
  opacity: 1;
}

.album-card:hover .album-info {
  transform: translateY(0);
}
</style>