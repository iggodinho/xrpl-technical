export default defineEventHandler(async (event) => {
  const sdk = getXummSdk()
  const payload = await sdk.payload.create({
    TransactionType: 'SignIn'
  })

  if (!payload) throw createError({ statusCode: 500, message: 'Xumm Error' })

  return {
    uuid: payload.uuid,
    qrUrl: payload.refs.qr_png,
    nextUrl: payload.next.always 
  }
})