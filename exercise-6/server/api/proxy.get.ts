export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)
  if (!url) {
    throw createError({ statusCode: 400, message: 'URL is required' })
  }
  try {
    const response = await fetch(url as string)
    
    if (!response.ok) throw new Error('Failed to fetch image')
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Length', buffer.length)
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return buffer
  } catch (error) {
    console.error('Proxy Error:', error)
    throw createError({ statusCode: 500, message: 'Error fetching image' })
  }
})

/*
Se carregarmos uma imagem externa diretamente num <canvas> e tentarmos extrair os dados 
(toBlob ou toDataURL), o navegador bloqueia a operação por segurança, pois é um tainted canvas.
O servidor faz o fetch da imagem original e entrega pro cliente como se fosse local.
O Buffer é a representação em memória dos dados binários da imagem. 
Ele é retornado no corpo da resposta HTTP. O destino é a tag <img> no frontend, 
que solicitou essa rota via atributo src. 
setHeader configura os metadados do protocolo HTTP. Embora minha função retorne apenas o buffer 
(response body), o framework se encarrega de montar o pacote HTTP completo, enviando os 
headers antes do corpo. Sem isso, o navegador não saberia renderizar os binários como uma imagem.
Como estou passando uma URL como parâmetro de query string, preciso usar o encodeURIComponent 
para escapar caracteres especiais. Isso garante que o servidor interprete a URL inteira da 
imagem como um único valor, evitando que parâmetros da imagem original sejam confundidos com 
parâmetros da minha API de proxy.
*/