import { getXummSdk } from '../utils/xumm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sdk = getXummSdk()
  const uriHex = Buffer.from(body.ipfsUrl, 'utf8').toString('hex').toUpperCase()

  const payload = await sdk.payload.create({
    TransactionType: 'NFTokenMint',
    NFTokenTaxon: 0, 
    URI: uriHex,
    Flags: 8, 
  })

  if (!payload) throw createError({ statusCode: 500, message: 'Xumm Error' })

  return {
    uuid: payload.uuid,
    qrUrl: payload.refs.qr_png,
    nextUrl: payload.next.always
  }
})