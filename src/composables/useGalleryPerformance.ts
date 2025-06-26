import { ref, onMounted } from 'vue'

export function useGalleryPerformance() {
  const metrics = ref({
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    loadTime: 0,
    imagesLoaded: 0,
    totalImages: 0
  })

  const startTime = Date.now()

  const trackImageLoad = () => {
    metrics.value.imagesLoaded++
    metrics.value.loadTime = Date.now() - startTime
  }

  const setTotalImages = (count: number) => {
    metrics.value.totalImages = count
  }

  const getLoadingProgress = () => {
    if (metrics.value.totalImages === 0) return 0
    return Math.round((metrics.value.imagesLoaded / metrics.value.totalImages) * 100)
  }

  onMounted(() => {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            metrics.value.lcp = entry.startTime
            break
          case 'first-input':
            const eventTiming = entry as PerformanceEventTiming
            metrics.value.fid = eventTiming.processingStart - eventTiming.startTime
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.value.cls += (entry as any).value
            }
            break
        }
      })
    })

    observer.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    })
  })

  return {
    metrics,
    trackImageLoad,
    setTotalImages,
    getLoadingProgress
  }
}