import xrpl from 'xrpl';
//https://xrpl.org/docs/tutorials/javascript/nfts/mint-and-burn-nfts#mint-nftsjs, https://xrpl.org/resources/dev-tools/xrp-faucets

//const secret='sEdVb4EYQbqrUrRgzLNqqK3r8JH58EJ' lembrar de trocar
const testnet= 'wss://s.altnet.rippletest.net:51233'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = config.secret
  const body = await readBody(event)
  const imageUrl = body.imageUrl
  const wallet = xrpl.Wallet.fromSeed(secret);
  const client = new xrpl.Client(testnet); 
    try {
        await client.connect()
        const transactionParams: xrpl.NFTokenMint = {
            TransactionType: "NFTokenMint",
            Account: wallet.classicAddress,
            URI: xrpl.convertStringToHex(imageUrl),
            Flags: 8, 
            NFTokenTaxon: 0, 
        }
        const tx = await client.submitAndWait(transactionParams, { wallet });
        
        return {
        success: true,
        txHash: tx.result.hash,
        account: wallet.address
        }

  } catch (error: any) {
    console.error("mint error:", error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  } finally {
    await client.disconnect()
  }
})