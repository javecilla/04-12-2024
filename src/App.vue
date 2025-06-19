<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import BookLoader from './components/BookLoader.vue';
import Navbar from './components/Navbar.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

const isLoading = ref(true);

onMounted(() => {
  // Show loader for 3 seconds
  setTimeout(() => {
    isLoading.value = false;
    // Initialize AOS after loading screen
    setTimeout(() => {
      AOS.init({
        once: false,
        mirror: true,
        startEvent: 'load',
        offset: 150,
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        anchorPlacement: 'bottom-bottom'
      });
    }, 100);
  }, 3000);
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#2c2c2c] text-[#2c2c2c] dark:text-white">
    <!-- Loading Overlay -->
    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-500" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="isLoading" class="fixed inset-0 bg-[#2c2c2c] z-50 flex items-center justify-center">
        <BookLoader />
      </div>
    </Transition>

    <!-- Main Content with Navbar -->
    <div v-show="!isLoading">
      <Transition enter-active-class="transition-opacity duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-show="!isLoading">
          <!-- Navbar -->
          <Navbar />

          <!-- Main Content -->
          <main class="pt-20">
            <router-view />
          </main>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
/* Remove any loader styling from components that previously had it */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* Add smooth scrollbar for Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

/* Webkit scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
