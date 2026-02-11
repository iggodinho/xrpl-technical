import { Client } from 'xrpl'

export const useTransactions = () => {
  const testnet='wss://s.altnet.rippletest.net:51233'
  const isConnected = ref(false)
  const currentBatch = ref([])
  let buffer = []
  let client = null
  let intervalId = null
  const connectAndListen = async () => {
    if (isConnected.value) return

    client = new Client(testnet)

    try {
      await client.connect()
      isConnected.value = true
     
      await client.request({
        command: 'subscribe',
        streams: ['transactions'] 
      })
   
      client.on('transaction', (tx) => {
        if (!isConnected.value) return 
        buffer.push(tx)
        //console.log(tx)
      })

      if (intervalId) clearInterval(intervalId)

      intervalId = setInterval(() => {
        if (!client || !isConnected.value) {
            if (intervalId) clearInterval(intervalId)
            return
        }

        if (buffer.length > 0) {
          currentBatch.value = [...buffer] 
          buffer = []
        } else {
             if (currentBatch.value.length > 0) currentBatch.value = []
        }
      }, 4000)

    } catch (error) {
      console.error('Erro na conexão WS:', error)
      isConnected.value = false
    }
  }

  const disconnect = () => {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
    
    isConnected.value = false 
    
    if (client) {
      client.disconnect()
      client = null
    }
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    connectAndListen,
    disconnect,
    isConnected,
    currentBatch
  }
}