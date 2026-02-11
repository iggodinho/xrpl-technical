export default defineEventHandler(async (event) => {
  const { uuid } = getQuery(event)
  const sdk = getXummSdk()

  if (!uuid) throw createError({ statusCode: 400, message: 'UUID required' })

  const payload = await sdk.payload.get(uuid as string)

  return {
    resolved: payload?.meta.resolved || false,
    signed: payload?.meta.signed || false,
    account: payload?.response.account || null,
    txHash: payload?.response.txid || null
  }
})