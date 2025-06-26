export function useResponsiveImages() {
  const getOptimizedImagePath = (originalPath: string, options: {
    width?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpg'
  } = {}) => {
    const { width, quality = 80, format } = options
    
    // Parse the original path
    const pathParts = originalPath.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const basePath = pathParts.slice(0, -1).join('/')
    const [name, originalExt] = fileName.split('.')
    
    // Build optimized filename
    let optimizedName = name
    if (width) optimizedName += `_${width}w`
    if (quality !== 80) optimizedName += `_q${quality}`
    
    const finalExt = format || originalExt
    
    return `${basePath}/${optimizedName}.${finalExt}`
  }

  const generatePictureElement = (src: string, alt: string, sizes?: string) => {
    const sources = [
      {
        srcset: getOptimizedImagePath(src, { format: 'avif' }),
        type: 'image/avif'
      },
      {
        srcset: getOptimizedImagePath(src, { format: 'webp' }),
        type: 'image/webp'
      }
    ]

    return {
      sources,
      fallback: {
        src: getOptimizedImagePath(src),
        alt,
        sizes
      }
    }
  }

  return {
    getOptimizedImagePath,
    generatePictureElement
  }
}