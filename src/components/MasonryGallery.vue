<template>
  <div class="masonry-wrapper">
    <div v-if="!isLoaded" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading the photos...</p>
    </div>
    
    <!-- Masonry Grid Layout - Always render the container -->
    <div ref="masonryContainer" class="masonry-grid" :class="{ 'masonry-loaded': isLoaded }">
      <div v-for="(photo, index) in randomizedPhotos" :key="photo.src" class="masonry-item" :class="{ 'item-loaded': loadedImages.has(index) }" data-aos="fade-up" data-aos-duration="300" data-aos-delay="10" data-aos-offset="20" data-aos-once="false">
        <SkeletonLoader v-if="!loadedImages.has(index)" class="skeleton-loader" />
        <img 
          :src="photo.src" 
          :alt="photo.alt" 
          class="gallery-image heart-cursor" 
          :class="{ 'image-loaded': loadedImages.has(index) }" 
          loading="lazy" 
          decoding="async"
          @load="onImageLoad($event, index)" 
          @error="onImageError(index)" 
        />
      </div>
    </div>

    <!-- Fallback Grid (if Masonry fails) -->
    <div v-if="!masonryLoaded && !isLoading && !isLoaded" class="fallback-grid">
      <div v-for="(photo, index) in randomizedPhotos" :key="photo.src" class="fallback-item" data-aos="fade-up" data-aos-duration="300" data-aos-delay="10" data-aos-offset="20" data-aos-once="false">
        <SkeletonLoader v-if="!loadedImages.has(index)" class="skeleton-loader" />
        <img 
          :src="photo.src" 
          :alt="photo.alt" 
          class="gallery-image heart-cursor" 
          :class="{ 'image-loaded': loadedImages.has(index) }" 
          loading="lazy" 
          decoding="async"
          @load="onImageLoad($event, index)" 
          @error="onImageError(index)" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import SkeletonLoader from './SkeletonLoader.vue';
import { useGalleryPerformance } from '../composables/useGalleryPerformance';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Types for Masonry
interface MasonryInstance {
  layout(): void;
  destroy(): void;
  reloadItems(): void;
}

declare global {
  interface Window {
    Masonry: new (element: Element, options: any) => MasonryInstance;
    imagesLoaded: (element: Element, callback: (instance: any) => void) => any;
  }
}

const props = defineProps<{
  photos: { src: string; alt?: string }[]
}>();

const masonryContainer = ref<HTMLElement | null>(null);
const masonryInstance = ref<MasonryInstance | null>(null);
const loadedImages = ref(new Set<number>());
const isLoaded = ref(false);
const masonryLoaded = ref(false);
const isLoading = ref(false);

// Use performance tracking
const { trackImageLoad, setTotalImages } = useGalleryPerformance();

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
const randomizedPhotos = ref<typeof props.photos>([]);

const masonryOptions = {
  itemSelector: '.masonry-item',
  columnWidth: '.masonry-item',
  gutter: 16,
  percentPosition: true,
  resize: true,
  initLayout: false
};

const initMasonry = () => {
  console.log('initMasonry called');
  console.log('Container:', masonryContainer.value);
  console.log('Masonry available:', typeof window.Masonry !== 'undefined');
  console.log('imagesLoaded available:', typeof window.imagesLoaded !== 'undefined');
  
  if (!masonryContainer.value) {
    console.error('Masonry container not available');
    return;
  }
  
  if (!window.Masonry) {
    console.error('Masonry library not available');
    return;
  }

  // Destroy existing instance if it exists
  if (masonryInstance.value) {
    masonryInstance.value.destroy();
  }

  console.log('Creating Masonry instance...');
  // Create new Masonry instance
  masonryInstance.value = new window.Masonry(masonryContainer.value, masonryOptions);
  console.log('Masonry instance created');

  // Wait for images to load, then layout
  if (window.imagesLoaded) {
    console.log('Using imagesLoaded to wait for images...');
    window.imagesLoaded(masonryContainer.value, () => {
      console.log('All images loaded, calling layout...');
      if (masonryInstance.value) {
        masonryInstance.value.layout();
        isLoaded.value = true;
        masonryLoaded.value = true;
      }
    });
  } else {
    console.log('imagesLoaded not available, using timeout fallback...');
    // Fallback if imagesLoaded is not available
    setTimeout(() => {
      if (masonryInstance.value) {
        masonryInstance.value.layout();
        isLoaded.value = true;
        masonryLoaded.value = true;
      }
    }, 100);
  }
};

const onImageLoad = (_event: Event, index: number) => {
  loadedImages.value.add(index);
  trackImageLoad();

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
  console.warn(`Failed to load image at index ${index}:`, randomizedPhotos.value[index]?.src);
  loadedImages.value.add(index); // Mark as "loaded" even if failed
  trackImageLoad();
};

// Load Masonry library dynamically
const loadMasonryLibrary = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window.Masonry !== 'undefined' && typeof window.imagesLoaded !== 'undefined') {
      resolve();
      return;
    }
    const imagesLoadedScript = document.createElement('script');
    imagesLoadedScript.src = 'https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js';
    imagesLoadedScript.onload = () => {
      const masonryScript = document.createElement('script');
      masonryScript.src = 'https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js';
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
  randomizedPhotos.value = shuffleArray([...newPhotos]);
  loadedImages.value.clear();
  isLoaded.value = false;
  setTotalImages(newPhotos.length);

  // Only reinitialize Masonry if it's already loaded
  if (masonryLoaded.value && masonryInstance.value) {
    nextTick(() => {
      if (masonryInstance.value) {
        masonryInstance.value.reloadItems();
        masonryInstance.value.layout();
      }
    });
  }
}, { immediate: true, deep: true });

// Resize handler
const handleResize = () => {
  if (masonryInstance.value) {
    masonryInstance.value.layout();
  }
};

onMounted(async () => {
  console.log('MasonryGallery mounted');
  setTotalImages(props.photos.length);
  isLoading.value = true;
  masonryLoaded.value = false;
  
  try {
    console.log('Loading Masonry library...');
    await loadMasonryLibrary();
    console.log('Masonry library loaded successfully');
    
    // Wait for the next tick to ensure DOM is ready
    await nextTick();
    console.log('DOM ready, initializing Masonry...');
    
    // Set masonryLoaded to true before initializing
    masonryLoaded.value = true;
    await nextTick(); // Wait for DOM update
    
    initMasonry();
    
    AOS.init({
      once: false,
      mirror: true,
      startEvent: 'load',
      offset: 150,
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      anchorPlacement: 'bottom-bottom'
    });

    // Add resize listener
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('Failed to initialize Masonry:', error);
    masonryLoaded.value = false;
  } finally {
    isLoading.value = false;
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

/* Fallback grid styles */
.fallback-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.fallback-item {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fallback-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Responsive fallback grid */
@media (max-width: 1200px) {
  .fallback-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    max-width: 1000px;
  }
}

@media (max-width: 900px) {
  .fallback-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .fallback-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    max-width: 600px;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .fallback-grid {
    grid-template-columns: 1fr;
    max-width: 100%;
    gap: 8px;
  }
}
</style>