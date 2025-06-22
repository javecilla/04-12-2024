<template>
  <header class="fixed top-0 left-0 right-0 z-40 transition-all duration-300" :class="[
    isScrolled
      ? 'border-b backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-lg'
      : 'bg-transparent',
    'dark:border-zinc-800/50 border-gray-200/50',
  ]">
    <div class="container mx-auto px-4">
      <nav class="nav-container relative flex h-16 items-center w-full">
        <!-- Left side - Audio Player -->
        <div class="flex items-center flex-shrink-0">
          <!-- audio player --> <!-- Background Music -->
          <audio ref="audioPlayer" loop>
            <source src="/audios/taylor-swift_love-story.mp3" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>

          <!-- Audio Player Card -->
          <div class="content-center">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 audio-player-container border border-gray-200 dark:border-gray-700 max-w-[320px]">
              <div class="flex items-center space-x-4">
                <!-- Album Cover - Left side -->
                <div class="flex-shrink-0">
                  <img src="/images/global/tailor-swift_love-story-cover-photo.jpg" alt="Love Story - Taylor Swift" class="w-12 h-12 rounded-lg object-cover shadow-md" loading="lazy" style="width: 68px !important; height: 68px !important; min-width: 48px; min-height: 48px;" />
                </div>

                <!-- Song Info and Play Button Container -->
                <div style="margin-top: -30px" class="flex-1 flex items-center justify-between min-w-0">
                  <!-- Song Info - Left -->
                  <div class="min-w-0 flex-1" style="margin-left: 10px">
                    <p style="font-size: 1.3rem;" class="font-normal text-gray-600 dark:text-gray-300 text-sm truncate">
                      <strong>Love Story</strong>
                    </p>
                    <p style="margin-top: -25px;" class="font-semibold text-gray-900 dark:text-white text-base truncate">
                      <em>Taylor Swift</em>
                    </p>
                  </div>

                  <!-- Play/Pause Button - Right -->
                  <div style="margin-left: 25px; margin-top: 10px" class="flex-shrink-0 ml-3">
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

        <!-- Middle spacer - creates the gap -->
        <div class="flex-grow"></div>

        <!-- Right side - Menu Icon -->
        <div class="right-side-content flex items-center flex-shrink-0">
          <button class="menu-bar-button p-2.5 rounded-full bg-transparent hover:bg-gray-800/80 text-gray-700 dark:text-gray-300">
            <MenuIcon class="w-6 h-6" />
          </button>
        </div>
      </nav>

      <!-- //TODO: side bar both mobile and desktop -->
    </div>
  </header>
  <!-- Spacer to prevent content from going under fixed header -->
  <div class="h-16"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { MenuIcon } from "lucide-vue-next";

const isScrolled = ref(false);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

function toggleAudio() {
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

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);

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
});

onUnmounted(() => {
  // Remove event listeners
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.removeEventListener('play', () => { });
    audioPlayer.value.removeEventListener('pause', () => { });
    audioPlayer.value.removeEventListener('ended', () => { });
  }
  window.removeEventListener("scroll", handleScroll);
});

</script>

<style scoped>
.audio-player-container {
  text-align: left !important;
}

.audio-player-container * {
  text-align: left !important;
}

/* Hover effects for the play button */
.group:hover svg {
  transform: scale(1.05);
}

svg {
  transition: all 0.3s ease;
}

.nav-container {
  width: 100%;
}

@media (min-width: 640px) {
  .nav-container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .nav-container {
    max-width: 768px;
  }
}
/* only applied this only large screen */
/* @media (min-width: 1024px) {
  nav {
    padding-left: 80px !important;
    padding-right: 80px !important;
  }
}

*/

/* Ensure flexbox behavior */
.flex {
  display: flex !important;
}

.items-center {
  align-items: center !important;
}

.menu-bar-button {
  background: transparent !important;
  border: none !important;
  outline: none !important;
}

.right-side-content {
  display: flex !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
  margin-right: 0 !important;
  padding: 0 !important;
  width: auto !important;
  height: auto !important;
}
</style>