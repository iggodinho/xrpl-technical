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