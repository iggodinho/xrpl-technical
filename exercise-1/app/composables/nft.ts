//app/composables/nft.ts
export const mintNft = async (imageUrl: string) => {
  try {
    const response = await $fetch('/api/mint', {
      method: 'POST',
      body: { imageUrl }
    })
    return {
      success: true,
      txHash: response.txHash,
      explorerLink: `https://testnet.xrpl.org/transactions/${response.txHash}`
    }
  } catch (error: any) {
    console.error('error:', error)
    throw error
  }
}