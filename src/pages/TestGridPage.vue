<template>
  <div class="min-h-screen bg-white dark:bg-[#2c2c2c] p-8">
    <div class="bg-[#f2f3fa] flex justify-center items-center min-h-screen">
    <card
        class="bg-white w-full max-w-[768px] flex justify-start items-center p-8 relative max-h-40 shadow-sm rounded-md">
        <img src="https://a10.gaanacdn.com/gn_img/albums/P7m3GvNKqx/7m3GVZx5Kq/size_l.jpg" class="rounded-xl w-[170px] mt-16">
        <p class="pl-9 text-2xl font-semibold grow">
            Roxette<br><span class="text-lg font-normal">Sleeping in my car</span>
        </p>
        <span class="clear-left rounded-full bg-[#eff0f9] p-4 cursor-pointer group [&_*]:transition-all [&_*]:duration-150 [&_*]:ease-in">
            <span class="px-3 py-3 block bg-white rounded-full shadow-md group-hover:bg-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="group-hover:fill-white group-hover:stroke-white" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7e9cff" fill="#7e9cff" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 4v16l13 -8z" />
                </svg>
            </span>
        </span>
    </card>
</div>

    <h1 class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
      Test 3x3 Grid Layout
    </h1>

    <!-- Simple 3x3 Grid -->
    <div class="test-grid max-w-4xl mx-auto">
      <div
        v-for="i in 9"
        :key="i"
        class="test-box"
        :style="{ backgroundColor: getRandomColor(i) }"
      >
        <span class="box-number">{{ i }}</span>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="mt-8 max-w-4xl mx-auto">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Debug Info:</h2>
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200">
        <p><strong>Grid Container:</strong> 3 columns, 1fr each</p>
        <p><strong>Gap:</strong> 1rem (16px)</p>
        <p><strong>Box Size:</strong> Square aspect ratio</p>
        <p><strong>Max Width:</strong> 4xl (896px)</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
function getRandomColor(index: number): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[index % colors.length];
}
</script>

<style scoped>
.test-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.test-box {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.test-box:hover {
  transform: scale(1.05);
}

.box-number {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .test-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
}

@media (max-width: 480px) {
  .test-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .box-number {
    font-size: 1.5rem;
  }
}
</style>