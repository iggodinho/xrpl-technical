import { XummSdk } from 'xumm-sdk'

let sdk: XummSdk | null = null

export const getXummSdk = () => {
  if (sdk) return sdk
  const config = useRuntimeConfig()
  sdk = new XummSdk(config.xummApiKey, config.xummApiSecret)
  return sdk
}