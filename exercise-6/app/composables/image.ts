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
    ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height)
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



/*
uso a tag img pra visualização rapida das mudanças, so que o CSS altera apenas como o navegador 
mostra a imagem, não altera o arquivo original. aplica uma "máscara" visual sobre a imagem original 
em tempo real.
Pra isso uso a tag canva, no background ela copia o filtro que to colocando na imagem, 
criando a nossa imagem que vai ser transformada em blob pra ser enviada pro ipfs, que espera um 
binary stream. Consome mais processamento por isso faço de forma oculta pra nao afetar ux-ui


*/