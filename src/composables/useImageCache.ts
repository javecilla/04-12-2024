class ImageCache {
  private cache = new Map<string, string>()
  private maxSize = 100 // Maximum cached images for gallery

  set(key: string, value: string) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  get(key: string): string | undefined {
    const value = this.cache.get(key)
    if (value) {
      // Move to end (LRU behavior)
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

export const imageCache = new ImageCache()

export function useImageCache() {
  const getCachedImage = (src: string) => imageCache.get(src)
  const setCachedImage = (src: string, data: string) => imageCache.set(src, data)
  const hasCachedImage = (src: string) => imageCache.has(src)
  const clearCache = () => imageCache.clear()
  const getCacheSize = () => imageCache.size()
  
  return {
    getCachedImage,
    setCachedImage,
    hasCachedImage,
    clearCache,
    getCacheSize
  }
}