import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useImageCache } from './useImageCache'
import { useGalleryPerformance } from './useGalleryPerformance'

interface ImageOptimizationOptions {
  src: string
  alt?: string
  sizes?: string
  lazy?: boolean
  quality?: 'low' | 'medium' | 'high'
  priority?: boolean
  placeholder?: string
  aspectRatio?: number
}

export function useImageOptimization(options: ImageOptimizationOptions) {
  const { getCachedImage, setCachedImage, hasCachedImage } = useImageCache()
  const { trackImageLoad } = useGalleryPerformance()
  
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentSrc = ref('')
  const imageElement = ref<HTMLImageElement | null>(null)
  
  let observer: IntersectionObserver | null = null
  let loadingTimeout: number | null = null

  // Simple image loading function
  const loadImage = async (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        setCachedImage(src, src)
        resolve(src)
      }
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      // Timeout for slow connections
      loadingTimeout = window.setTimeout(() => {
        reject(new Error('Image load timeout'))
      }, 10000)
      
      img.src = src
    })
  }

  // Setup intersection observer for lazy loading
  const setupLazyLoading = () => {
    if (!options.lazy || !imageElement.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadOptimizedImage()
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.1
      }
    )

    observer.observe(imageElement.value)
  }

  // Main image loading function
  const loadOptimizedImage = async () => {
    if (isLoading.value || isLoaded.value) return
    
    isLoading.value = true
    error.value = null

    try {
      // Check cache first
      if (hasCachedImage(options.src)) {
        currentSrc.value = getCachedImage(options.src)!
        isLoaded.value = true
        trackImageLoad()
        return
      }

      // Load the original image directly
      const loadedSrc = await loadImage(options.src)
      currentSrc.value = loadedSrc
      isLoaded.value = true
      trackImageLoad()
      
    } catch (err) {
      error.value = 'Failed to load image'
      currentSrc.value = options.src // Fallback to original
      console.warn('Image optimization error:', err)
    } finally {
      isLoading.value = false
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
        loadingTimeout = null
      }
    }
  }

  // Computed properties for template
  const imageAttributes = computed(() => {
    return {
      src: currentSrc.value,
      alt: options.alt || '',
      loading: options.lazy ? 'lazy' : 'eager',
      decoding: 'async' as const,
      ...(options.aspectRatio && { style: `aspect-ratio: ${options.aspectRatio}` })
    }
  })

  onMounted(() => {
    if (options.priority || !options.lazy) {
      loadOptimizedImage()
    } else {
      setupLazyLoading()
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (loadingTimeout) {
      clearTimeout(loadingTimeout)
    }
  })

  return {
    // State
    isLoaded,
    isLoading,
    error,
    currentSrc,
    imageElement,
    
    // Computed
    imageAttributes,
    
    // Methods
    loadOptimizedImage,
    reload: () => {
      isLoaded.value = false
      error.value = null
      loadOptimizedImage()
    }
  }
} 