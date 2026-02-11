export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  const config = useRuntimeConfig()

  if (!body || !body[0]) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  const formData = new FormData()
  const file = new Blob([body[0].data], { type: body[0].type })
  formData.append('file', file, `nft-clock-${Date.now()}.png`)

  try {
    const response = await $fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.pinataJWT}`
      },
      body: formData
    }) as any
    console.log(response)
    return {
      success: true,
      ipfsHash: response.IpfsHash,
      url: `https://copper-characteristic-python-349.mypinata.cloud/ipfs/${response.IpfsHash}`
    }
  } catch (error) {
    console.error('IPFS Error:', error)
    throw createError({ statusCode: 500, message: 'IPFS Upload Failed' })
  }
})