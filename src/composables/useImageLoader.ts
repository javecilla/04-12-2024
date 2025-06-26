import { ref, onMounted, onUnmounted } from 'vue'

interface ImageLoadOptions {
  src: string
  placeholder?: string
  sizes?: string
  lazy?: boolean
  quality?: 'low' | 'medium' | 'high'
}

export function useImageLoader(options: ImageLoadOptions) {
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const imageSrc = ref(options.placeholder || '')
  
  let observer: IntersectionObserver | null = null
  const imageElement = ref<HTMLImageElement | null>(null)

  // Generate responsive image sources based on your folder structure
  const generateSrcSet = (baseSrc: string) => {
    // Extract path and filename
    const pathParts = baseSrc.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const basePath = pathParts.slice(0, -1).join('/')
    const name = fileName.split('.')[0]
    
    // Try to find optimized versions (WebP, AVIF)
    const webpSrc = `${basePath}/${name}.webp`
    const avifSrc = `${basePath}/${name}.avif`
    
    return {
      avif: avifSrc,
      webp: webpSrc,
      original: baseSrc
    }
  }

  const loadImage = async () => {
    if (isLoading.value || isLoaded.value) return
    
    isLoading.value = true
    error.value = null

    try {
      const srcSet = generateSrcSet(options.src)
      
      // Try modern formats first, fallback to original
      const sources = [srcSet.avif, srcSet.webp, srcSet.original]
      
      for (const src of sources) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = resolve
            img.onerror = reject
            img.src = src
            
            // Timeout for slow connections
            setTimeout(reject, 8000)
          })
          
          imageSrc.value = src
          isLoaded.value = true
          break
        } catch {
          // Continue to next format
          continue
        }
      }
      
      if (!isLoaded.value) {
        throw new Error('All image formats failed to load')
      }
      
    } catch (err) {
      error.value = 'Failed to load image'
      imageSrc.value = options.src // Fallback to original
      console.warn('Image load error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const setupIntersectionObserver = () => {
    if (!options.lazy || !imageElement.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    )

    observer.observe(imageElement.value)
  }

  onMounted(() => {
    if (options.lazy) {
      setupIntersectionObserver()
    } else {
      loadImage()
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return {
    imageSrc,
    isLoaded,
    isLoading,
    error,
    imageElement,
    loadImage
  }
}