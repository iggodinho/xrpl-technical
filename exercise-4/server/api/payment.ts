export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sdk = getXummSdk()
  const amountInDrops = (parseFloat(body.amount) * 1000000).toString()

  const payload = await sdk.payload.create({
    TransactionType: 'Payment',
    Destination: body.destination,
    Amount: amountInDrops
  })

  if (!payload) throw createError({ statusCode: 500, message: 'Xumm Error' })

  return {
    uuid: payload.uuid,
    qrUrl: payload.refs.qr_png,
    nextUrl: payload.next.always
  }
})