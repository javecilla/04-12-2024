<template>
  <div class="masonry-wrapper">
    <div v-if="!isLoaded" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading the photos...</p>
    </div>
    <div ref="masonryContainer" class="masonry-grid" :class="{ 'masonry-loaded': isLoaded }">
      <div v-for="(photo, index) in randomizedPhotos" :key="photo.src" class="masonry-item" :class="{ 'item-loaded': loadedImages.has(index) }" data-aos="fade-up" data-aos-duration="300" data-aos-delay="10" data-aos-offset="20" data-aos-once="false">
        <SkeletonLoader v-if="!loadedImages.has(index)" class="skeleton-loader" />
        <img :src="photo.src" :alt="photo.alt" class="gallery-image heart-cursor" :class="{ 'image-loaded': loadedImages.has(index) }" loading="lazy" @load="onImageLoad($event, index)" @error="onImageError(index)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import SkeletonLoader from './SkeletonLoader.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Types for Masonry
interface MasonryInstance {
  layout(): void;
  destroy(): void;
  reloadItems(): void;
  appended(elements: Element[]): void;
}

declare global {
  interface Window {
    Masonry: new (element: Element, options: any) => MasonryInstance;
    imagesLoaded: (element: Element, callback: () => void) => void;
  }
}

const props = defineProps<{
  photos: { src: string; alt?: string }[]
}>();

const masonryContainer = ref<HTMLElement | null>(null);
const masonryInstance = ref<MasonryInstance | null>(null);
const loadedImages = ref(new Set<number>());
const isLoaded = ref(false);
const loadedCount = ref(0);
const shuffledPhotos = ref<typeof props.photos>([]);

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Computed property that returns randomized photos
const randomizedPhotos = computed(() => {
  return shuffledPhotos.value.length > 0 ? shuffledPhotos.value : props.photos;
});

const masonryOptions = {
  itemSelector: '.masonry-item',
  columnWidth: '.masonry-item',
  gutter: 16,
  percentPosition: false, // Changed to false for better centering
  transitionDuration: '0.3s',
  resize: true,
  initLayout: false, // We'll trigger layout manually after images load
  horizontalOrder: true // Keep items in order
};

const initMasonry = () => {
  if (!masonryContainer.value || !window.Masonry) {
    console.error('Masonry container or library not available');
    return;
  }

  // Destroy existing instance if it exists
  if (masonryInstance.value) {
    masonryInstance.value.destroy();
  }

  // Create new Masonry instance
  masonryInstance.value = new window.Masonry(masonryContainer.value, masonryOptions);

  // Wait for images to load, then layout
  if (window.imagesLoaded) {
    window.imagesLoaded(masonryContainer.value, () => {
      if (masonryInstance.value) {
        masonryInstance.value.layout();
        isLoaded.value = true;
      }
    });
  } else {
    // Fallback if imagesLoaded is not available
    setTimeout(() => {
      if (masonryInstance.value) {
        masonryInstance.value.layout();
        isLoaded.value = true;
      }
    }, 100);
  }
};

const onImageLoad = (_event: Event, index: number) => {
  loadedImages.value.add(index);
  loadedCount.value++;

  // Trigger layout update when image loads
  if (masonryInstance.value) {
    nextTick(() => {
      masonryInstance.value?.layout();
      // Refresh AOS after masonry layout updates
      AOS.refresh();
    });
  }
};

const onImageError = (index: number) => {
  console.warn(`Failed to load image at index ${index}`);
  loadedImages.value.add(index); // Mark as "loaded" even if failed
  loadedCount.value++;
};

// Load Masonry library dynamically
const loadMasonryLibrary = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.Masonry) {
      resolve();
      return;
    }

    // Load imagesLoaded first (dependency)
    const imagesLoadedScript = document.createElement('script');
    imagesLoadedScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js';
    imagesLoadedScript.onload = () => {
      // Then load Masonry
      const masonryScript = document.createElement('script');
      masonryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js';
      masonryScript.onload = () => resolve();
      masonryScript.onerror = () => reject(new Error('Failed to load Masonry'));
      document.head.appendChild(masonryScript);
    };
    imagesLoadedScript.onerror = () => reject(new Error('Failed to load imagesLoaded'));
    document.head.appendChild(imagesLoadedScript);
  });
};

// Watch for photos changes and reinitialize
watch(() => props.photos, (newPhotos) => {
  shuffledPhotos.value = shuffleArray([...newPhotos]);
  loadedImages.value.clear();
  loadedCount.value = 0;
  isLoaded.value = false;

  nextTick(() => {
    if (masonryInstance.value) {
      masonryInstance.value.reloadItems();
      masonryInstance.value.layout();
    }
  });
}, { immediate: true, deep: true });

// Resize handler
const handleResize = () => {
  if (masonryInstance.value) {
    masonryInstance.value.layout();
  }
};

onMounted(async () => {
  try {
    await loadMasonryLibrary();
    await nextTick();
    initMasonry();
    AOS.init({
      once: false,
      mirror: true,
      startEvent: 'load', // Changed from DOMContentLoaded to load
      offset: 150,
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      anchorPlacement: 'bottom-bottom' // Animate when bottom of element is at bottom of viewport
    });

    // Add resize listener
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('Failed to initialize Masonry:', error);
  }
});

onUnmounted(() => {
  if (masonryInstance.value) {
    masonryInstance.value.destroy();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.masonry-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  position: relative;
  min-height: 400px;
  /* Add minimum height to ensure loading state is visible */
  /* disabled the horizantal scroll */
  overflow-x: hidden !important;
}

.masonry-grid {
  opacity: 0;
  transition: opacity 0.5s ease;
  max-width: 1200px;
  /* Maximum width for the grid */
  width: 100%;
  position: relative;
  margin: 0 auto;
  /* Add margin auto for better centering */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* Center items horizontally */
}

.masonry-grid.masonry-loaded {
  opacity: 1;
}

.masonry-item {
  width: 280px;
  /* Fixed width for better control */
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  /* Added for skeleton positioning */
}

.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.masonry-item.item-loaded {
  opacity: 1;
  transform: translateY(0);
}

.masonry-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.gallery-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease, filter 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
  opacity: 0;
  z-index: 2;
  position: relative;
}

.gallery-image.image-loaded {
  opacity: 1;
}

/* Loading state styles */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
  gap: 1rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
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

/* Responsive breakpoints */
@media (max-width: 1200px) {
  .masonry-item {
    width: 260px;
  }

  .masonry-grid {
    max-width: 1000px;
  }
}

@media (max-width: 900px) {
  .masonry-item {
    width: 240px;
  }

  .masonry-grid {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .masonry-item {
    width: 220px;
    margin-bottom: 12px;
    margin-left: 25px !important;
  }

  .masonry-grid {
    max-width: 600px;
  }

  .masonry-wrapper {
    padding: 0.5rem;
    /* margin-left: 10px !important; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* disabled scroll horizontally */
    overflow-x: hidden;
  }
}

@media (max-width: 480px) {
  .masonry-item {
    width: calc(100vw - 2rem);
    max-width: 300px;
    margin-bottom: 8px;
    margin-left: 7px !important;
  }

  .masonry-grid {
    max-width: 100%;
    padding: 0 1rem;
    /* Add padding for better spacing */
  }

  .masonry-wrapper {
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .masonry-item {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .masonry-item:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .loading-text {
    color: #999;
  }

  .loading-spinner {
    border-color: #333;
    border-top-color: #ffffff;
  }
}
</style>