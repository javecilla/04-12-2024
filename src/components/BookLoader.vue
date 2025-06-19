<template>
  <div class="loader-container">
    <div class="book">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <span class="loading-text">Loading memories...</span>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}

.loading-text {
  color: white;
  font-size: 0.875rem;
  margin-top: 1rem;
}

@keyframes whirl-book {
  0% {
    transform: rotateY(0deg);
  }
  50%,
  80% {
    transform: rotateY(-180deg);
  }
  90%,
  100% {
    opacity: 0;
    transform: rotateY(-180deg);
  }
}

.book {
  height: 40px;
  position: relative;
  width: 40px;
  perspective: 60px;
}

.book div {
  animation: whirl-book 2s infinite;
  background: white;
  height: 100%;
  position: absolute;
  left: 50%;
  transform-origin: left;
  width: 100%;
}

.book div:nth-child(1) {
  animation-delay: 0.15s;
}

.book div:nth-child(2) {
  animation-delay: 0.3s;
}

.book div:nth-child(3) {
  animation-delay: 0.45s;
}

.book div:nth-child(4) {
  animation-delay: 0.6s;
}

.book div:nth-child(5) {
  animation-delay: 0.75s;
}
</style>
