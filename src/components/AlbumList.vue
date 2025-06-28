<template>
  <div class="album-list-container">
    <div class="header-section">
      <!-- <h1 class="album-main-title poppins-bold-italic text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
        Gunita sa araw na ako'y naging sa iyo.
      </h1> -->
      <!-- <p class="album-sub-title text-xl text-gray-600 dark:text-gray-300">
        04122024
      </p> -->
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading the albums...</p>
    </div>

    <!-- Masonry Grid Layout -->
    <div v-else ref="masonryContainer" class="masonry-grid">
      <div class="masonry-sizer"></div>
      <!-- data-aos="fade-up" data-aos-duration="300" data-aos-delay="10" data-aos-offset="20" data-aos-once="false" -->
      <div v-for="album in albums" :key="album.id" class="masonry-item">
        <AlbumCard :album="album" class="album-card" @click="goToAlbum(album)" @image-loaded="onImageLoad" />
      </div>
    </div>

    <!-- Fallback Grid (if Masonry fails) -->
    <div v-if="!isLoading && !masonryLoaded" class="fallback-grid">
      <div v-for="album in albums" :key="album.id" class="fallback-item">
        <AlbumCard :album="album" class="album-card" @click="goToAlbum(album)" @image-loaded="onImageLoad" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
import { useGalleryStore } from '../stores/gallery';
import { useGalleryPerformance } from '../composables/useGalleryPerformance';
import AlbumCard from './AlbumCard.vue';

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

const router = useRouter();
const galleryStore = useGalleryStore();
const { trackImageLoad, setTotalImages } = useGalleryPerformance();

const masonryContainer = ref<HTMLElement | null>(null);
const masonryInstance = ref<MasonryInstance | null>(null);
const isLoading = ref(true);
const masonryLoaded = ref(false);
const albums = ref<any[]>([]);

const masonryOptions = {
  itemSelector: '.masonry-item',
  columnWidth: '.masonry-sizer',
  gutter: 45,
  percentPosition: false,
  resize: true,
  initLayout: true,
  fitWidth: true
};

const initMasonry = () => {
  if (!masonryContainer.value || !window.Masonry) return;

  // Destroy existing instance if any
  if (masonryInstance.value) {
    masonryInstance.value.destroy();
  }

  // Ensure container has proper dimensions before initializing
  if (masonryContainer.value.offsetWidth === 0) {
    // Container not yet sized, wait a bit more
    setTimeout(() => {
      initMasonry();
    }, 50);
    return;
  }

  masonryInstance.value = new window.Masonry(masonryContainer.value, masonryOptions);

  // Use imagesLoaded to ensure all images are loaded before layout
  const imgLoad = window.imagesLoaded(masonryContainer.value, () => {
    if (masonryInstance.value) {
      // Force layout recalculation after images load
      nextTick(() => {
        masonryInstance.value?.layout();
      });
    }
  });

  // Handle progress for better layout updates
  imgLoad.on('progress', () => {
    if (masonryInstance.value) {
      nextTick(() => {
        masonryInstance.value?.layout();
      });
    }
  });
};

const onImageLoad = () => {
  trackImageLoad();
  if (masonryInstance.value) {
    nextTick(() => {
      masonryInstance.value?.layout();
    });
  }
};

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

const handleResize = () => {
  if (masonryInstance.value) {
    masonryInstance.value.layout();
  }
};

function goToAlbum(album: any) {
  router.push({ name: 'AlbumPhotos', params: { albumId: album.id } });
}

onMounted(async () => {
  // AOS.init({
  //   once: false,
  //   mirror: true,
  //   duration: 600,
  // });

  try {
    await loadMasonryLibrary();
    
    // Load albums first
    albums.value = [...galleryStore.albums];
    setTotalImages(albums.value.length);
    isLoading.value = false;
    masonryLoaded.value = true;
    
    // Wait for DOM to be fully rendered
    await nextTick();
    
    // Wait for container to be properly sized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize Masonry
    initMasonry();
    
    // Force layout recalculation after everything is loaded
    setTimeout(() => {
      if (masonryInstance.value) {
        masonryInstance.value.layout();
      }
    }, 300);
    
  } catch (error) {
    console.error("Failed to load Masonry library", error);
    albums.value = [...galleryStore.albums];
    setTotalImages(albums.value.length);
    isLoading.value = false;
    masonryLoaded.value = false;
  }

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (masonryInstance.value) {
    masonryInstance.value.destroy();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.album-list-container {
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  margin-left: -35px;
}

.header-section {
  width: 100%;
  max-width: 1400px;
  text-align: center;
  margin: 0 auto 2rem auto;
}

.masonry-grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.masonry-sizer {
  width: 280px;
}

.masonry-item {
  width: 280px;
  margin-bottom: 13px;
  /* Remove horizontal padding - let Masonry handle gutters */
}

.album-card {
  width: 100%;
  height: 100%;
}

/* Responsive Breakpoints */
@media (max-width: 1200px) {
  .masonry-sizer,
  .masonry-item {
    width: 280px;
  }
}

@media (max-width: 992px) {
  .masonry-sizer,
  .masonry-item {
    width: 240px;
  }
  
  .fallback-item {
    width: calc(50% - 12px);
  }
}

@media (max-width: 768px) {
  .masonry-sizer,
  .masonry-item {
    width: 320px;
  }
  
  .fallback-item {
    width: calc(50% - 12px);
  }
}

@media (max-width: 480px) {
  .album-list-container {
    margin-left: -1px;
  }
  .masonry-sizer,
  .masonry-item {
    width: 320px;
  }
  
  .fallback-item {
    width: 100%;
  }
}

/* Loading state styles */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

.fallback-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.fallback-item {
  width: 22%;
  padding: 0 12px;
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  .loading-text {
    color: #999;
  }

  .loading-spinner {
    border-color: #333;
      border-top-color: #ffffff;
  }
}
</style>