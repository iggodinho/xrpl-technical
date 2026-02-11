export const useImageEditor = () => {
  const brightness = ref(100)
  const hue = ref(0)
  
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const previewImg = ref<HTMLImageElement | null>(null)

  const resetFilters = () => {
    brightness.value = 100
    hue.value = 0
  }

  const updateCanvas = () => {
    if (!canvasRef.value || !previewImg.value) return
    
    const ctx = canvasRef.value.getContext('2d')
    const img = previewImg.value
    
    if (!ctx || !img) return

    canvasRef.value.width = img.naturalWidth
    canvasRef.value.height = img.naturalHeight
    ctx.filter = `brightness(${brightness.value}%) hue-rotate(${hue.value}deg)`
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
  }

  const getCanvasBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!canvasRef.value) return reject(new Error('Canvas not found'))
      
      canvasRef.value.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas conversion failed'))
      }, 'image/png')
    })
  }

  return {
    brightness,
    hue,
    canvasRef,
    previewImg,
    updateCanvas,
    resetFilters,
    getCanvasBlob
  }
}