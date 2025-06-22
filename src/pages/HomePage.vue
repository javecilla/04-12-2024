<!-- HomePage.vue -->
<template>
  <section class="relative w-full overflow-hidden transition-all duration-500" @mouseenter="pauseSlideshow" @mouseleave="resumeSlideshow">
    <!-- Gradient Overlay - Dark at bottom fading to transparent -->
    <div class="absolute inset-0 h-full bg-gradient-to-t from-black via-black/70 to-transparent z-5"></div>

    <!-- Background Image Carousel -->
    <template v-for="(image, index) in images" :key="index">
      <transition name="fade">
        <div v-if="currentImageIndex === index" :class="[scrolled ? 'carousel-wrapper' : '']">
          <img :src="image" alt="Background Image" :class="[scrolled ? 'object-cover w-full h-full carousel-bg-image' : 'object-cover w-full h-full']" style="display:block;width:100%;height:100%;box-sizing:border-box;" loading="lazy" />
        </div>
      </transition>
    </template>

    <!-- Navigation Dots -->
    <!-- absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20 -->
    <div class="carousel-navigator-container">
      <!-- w-3 h-3 rounded-full border-2 border-white -->
      <button v-for="(_, index) in images" :key="index" @click="setCurrentImage(index)" class="carousel-navigator-btn transition-all duration-300" :class="{ 'active': currentImageIndex === index, '': currentImageIndex !== index }" aria-label="Select image"></button>
    </div>

    <div class="ap-main-container">
      <!-- audio player --> <!-- Background Music -->
      <audio ref="audioPlayer" loop>
        <source src="/audios/taylor-swift_love-story.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>

      <!-- Audio Player Card -->
      <div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 audio-player-container border border-gray-200 dark:border-gray-700 max-w-[320px]">
          <div class="flex items-center space-x-4">
            <!-- Album Cover - Left side -->
            <div class="flex-shrink-0">
              <img src="/images/global/tailor-swift_love-story-cover-photo.jpg" alt="Love Story - Taylor Swift" class="ap-song-image  object-cover shadow-md" loading="lazy" />
            </div>

            <!-- Song Info and Play Button Container -->
            <div class="ap-song-info-container flex-1 flex items-center justify-between min-w-0">
              <!-- Song Info - Left -->
              <div class="ap-song-text-container min-w-0 flex-1">
                <p class="song-title poppins-semibold text-gray-600 dark:text-gray-300 text-sm truncate">
                  Love Story
                </p>
                <p class="artist-name font-regular text-gray-900 dark:text-white text-base truncate">
                  Taylor Swift
                </p>
              </div>

              <!-- Play/Pause Button - Right -->
              <div class="ap-btn-container bflex-shrink-0 ml-3">
                <div @click="toggleAudio" class="w-12 h-12 rounded-full bg-[#fb5835] hover:bg-[#e04e2e] cursor-pointer group transition-all duration-300 flex items-center justify-center shadow-lg">
                  <!-- Play Icon -->
                  <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="text-white transition-transform duration-300 group-hover:scale-110" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <!-- Pause Icon -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="text-white transition-transform duration-300 group-hover:scale-110" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Content Container -->
    <div class="relative h-full flex items-end justify-between p-8 md:p-12 lg:p-16 z-30">
      <div class="title-content text-white z-10">
        <!-- <transition name="fade-caption" mode="out-in">
        </transition> -->
        <h5 :key="currentImageIndex" class="poppins-medium text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-none">
          {{ captions[currentImageIndex] }}
        </h5>
      </div>
      <div class="code-content text-white z-10 max-w-md">
        <p class="text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
          <em>04122024</em>
        </p>
      </div>
    </div>
  </section>

  <section class="album-section">
    <div class="header-title-container container">
      <h1 class="poppins-medium">Gunita sa araw na ako'y naging sa iyo.</h1>
    </div>

    <div class="album-container">
      <AlbumList />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import AlbumList from '../components/AlbumList.vue';

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

const images = ref([
  '/images/global/ms3.jpg',
  '/images/global/ms12.png',
  '/images/global/ms6.png',
]);

const captions = ref([
  "Walang sawa na ika'y mamahalin ng higit pa.",
  "Ikaw ang nag-iisang paborito kong alaala.",
  "Pipiliin ka sa araw araw ng buhay ko."
]);

const currentImageIndex = ref(0);
const slideshowInterval = ref<number | null>(null);
const SLIDESHOW_DELAY = 10000; // 10 seconds

// --- SCROLL EFFECT ---
const scrolled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 40;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
};

const setCurrentImage = (index: number) => {
  currentImageIndex.value = index;
  resetSlideshowTimer();
};

const startSlideshow = () => {
  if (slideshowInterval.value) return;
  slideshowInterval.value = window.setInterval(nextImage, SLIDESHOW_DELAY);
};

const stopSlideshow = () => {
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value);
    slideshowInterval.value = null;
  }
};

const resetSlideshowTimer = () => {
  stopSlideshow();
  startSlideshow();
};

const pauseSlideshow = () => {
  stopSlideshow();
};

const resumeSlideshow = () => {
  startSlideshow();
};

const toggleAudio = () => {
  if (!audioPlayer.value) return;

  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
  }
  isPlaying.value = !isPlaying.value;
}

onMounted(() => {
  // Start the slideshow
  startSlideshow();

  // Set up audio player
  if (audioPlayer.value) {
    // Add event listeners for audio state changes
    audioPlayer.value.addEventListener('play', () => {
      isPlaying.value = true;
    });
    audioPlayer.value.addEventListener('pause', () => {
      isPlaying.value = false;
    });
    audioPlayer.value.addEventListener('ended', () => {
      isPlaying.value = false;
    });

    // Attempt to auto-play
    audioPlayer.value.muted = false; // Ensure it's not muted initially
    audioPlayer.value.play()
      .then(() => {
        isPlaying.value = true;
        console.log('Auto-play started successfully');
      })
      .catch(error => {
        console.log('Auto-play was prevented:', error);
        // The play() promise was rejected, likely due to browser autoplay policy
        isPlaying.value = false;
      });
  }

  // Start the image slideshow
  resumeSlideshow();

  // Add scroll event
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // Remove event listeners
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.removeEventListener('play', () => { });
    audioPlayer.value.removeEventListener('pause', () => { });
    audioPlayer.value.removeEventListener('ended', () => { });
  }

  // Clear the slideshow interval
  pauseSlideshow();

  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Ensure full screen coverage */
section {
  margin: 0 !important;
  padding: 0 !important;
  /* overflow-x: hidden !important; */
}

/* Image styles */
img {
  min-width: 100vw;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

/* Carousel transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Caption transitions */
.fade-caption-enter-active,
.fade-caption-leave-active {
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-caption-enter-from,
.fade-caption-leave-to {
  opacity: 0;
}

.fade-caption-enter-to,
.fade-caption-leave-from {
  opacity: 1;
}

/* Navigation dots */
.carousel-navigator-container {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 20;
}

.carousel-navigator-btn {
  border-radius: 50%;
  background: transparent !important;
  border: 1px solid #ffffff;
  width: .5rem;
  height: .5rem;
  /* margin-left: 2px; */
}

.carousel-navigator-btn.active {
  background: #ffffff !important;
}

.carousel-navigator-btn:hover {
  transform: scale(1.2);
}

/* --- SCROLL EFFECT STYLES --- */
.carousel-bg-image {
  background: transparent !important;
  padding: 15px !important;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  /* box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18); */
  transition: padding 0.8s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.ap-main-container {
  position: absolute;
  top: 95%;
  /*90 */
  left: 2.7%;
}

.ap-song-image {
  width: 60px !important;
  height: 60px !important;
  min-width: 48px;
  min-height: 48px;
}

.ap-song-info-container {
  margin-top: -90px;
  margin-left: 60px;
}

.ap-song-text-container {
  margin-left: 10px;
}

.ap-song-text-container .song-title {
  font-size: 1.2rem;
}

.ap-song-text-container .artist-name {
  margin-top: -30px;
}

.ap-btn-container {
  margin-left: 5px;
  margin-top: -15px
}

/* Existing styles */
.title-content {
  position: absolute;
  top: 48%;
  left: 43%;
}

.code-content {
  position: absolute;
  top: 97%;
  right: 2.7%;
}

.header-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 50px auto 0 auto;
}

.header-title-container h1 {
  font-size: 6.5rem;
  font-weight: 500;
  color: #ffffff;
  text-transform: uppercase;
  margin-top: 20px;
}

/* Album section styles */
.album-section {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: visible;
  position: relative;
}

.album-container {
  margin-left: 55px;
}

@media only screen and (max-width: 480px) {
  .carousel-bg-image {
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
  }

  .ap-main-container {
    top: 88%;
    left: 7%;
  }

  .ap-song-image {
    width: 55px !important;
    height: 55px !important;
  }

  .ap-song-info-container {
    margin-top: -83px;
    margin-left: 53px;
  }

  .ap-song-text-container {
    margin-left: 10px;
  }

  .ap-song-text-container .song-title {
    font-size: 1.1rem;
  }

  .ap-song-text-container .artist-name {
    font-size: 1rem;
    margin-top: -30px;
  }

  .title-content {
    top: 48%;
    left: 15%;
  }

  .code-content {
    top: 90%;
    right: 7.5%;
  }

  .code-content p {
    font-size: 0.9rem;
  }

  .header-title-container {
    max-width: 300px;
  }

  .header-title-container h1 {
    font-size: 2.5rem;
  }

  .album-container {
    margin-left: -32px;
    /* margin-right: 20px; */
  }
}
</style>