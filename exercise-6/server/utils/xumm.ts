import { XummSdk } from 'xumm-sdk'

let sdk: XummSdk | null = null

export const getXummSdk = () => {
  if (sdk) return sdk
  
  const config = useRuntimeConfig()
  console.log(config)
  sdk = new XummSdk(config.xummApiKey, config.xummApiSecret)
  return sdk
}