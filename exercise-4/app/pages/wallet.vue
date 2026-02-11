<template>
  <div class="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-blue-900 mb-8">XRPL Commons</h1>

    <div v-if="!account" class="text-center">
      <p class="mb-4 text-gray-600">Connect your Xaman wallet to continue</p>
      <Button @click="connectWallet">Connect to Xaman</Button>
    </div>

    <div v-else class="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <span class="text-sm font-bold text-green-600">Connected</span>
        <span class="text-xs text-gray-500 font-mono">{{ truncate(account) }}</span>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Recipient Address</label>
        <input 
          v-model="destination" 
          type="text" 
          placeholder="r..."
          class="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
        >
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Amount (XRP)</label>
        <input 
          v-model="amount" 
          type="number" 
          placeholder="0.00"
          class="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
        >
      </div>

      <Button class="w-full" disabled:cursor-not-allowed 
      @click="sendPayment" 
      :disabled="!isValidForm" >
        Send XRP
      </Button>
    </div>

    <Modal :show="showModal" :header="modalHeader" @close="closeModal">
      <div class="flex flex-col items-center">
        <p class="mb-4 text-center text-gray-600">Scan with Xaman App</p>
        <img v-if="qrUrl" :src="qrUrl" class="rounded-lg shadow-sm border p-2 mb-4 w-64 h-64" />
        <p class="text-sm text-gray-400 animate-pulse">Waiting for signature...</p>
      </div>
    </Modal>

    <div v-if="txHash" class="mt-6 p-4 bg-green-100 text-green-800 rounded-lg max-w-md break-all text-center">
      <strong>Transaction Success!</strong><br>
      <span class="text-xs">{{ txHash }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const account = ref('')
const destination = ref('')
const amount = ref('')
const txHash = ref('')
const showModal = ref(false)
const qrUrl = ref('')
const modalHeader = ref('')
const activeUuid = ref('')
let pollInterval: any = null
const isPayment = ref(false)
const truncate = (str: string) => str.slice(0, 6) + '...' + str.slice(-4)
const isValidForm = computed(() => destination.value.startsWith('r') && Number(amount.value) > 0)

const connectWallet = async () => {
  try {
    const data = await $fetch('/api/auth', { method: 'POST' })
    openModal('Sign In', data.uuid, data.qrUrl)
  } catch (e) { alert('Error init auth') }
}

const sendPayment = async () => {
  isPayment.value = true
  // console.log( { dest: destination.value, amt: amount.value })
  if (!isValidForm.value) {
    return
  }
  try {
    const data = await $fetch('/api/payment', {
      method: 'POST',
      body: { destination: destination.value, amount: amount.value }
    })
    openModal('Confirm Transaction', data.uuid, data.qrUrl)
  } catch (e) { alert('Error init payment') }
}

const openModal = (title: string, uuid: string, url: string) => {
  modalHeader.value = title
  activeUuid.value = uuid
  qrUrl.value = url
  showModal.value = true
  txHash.value = '' 
  pollInterval = setInterval(checkStatus, 2000)
}

const checkStatus = async () => {
  if (!activeUuid.value) return
  try {
    const status = await $fetch(`/api/check?uuid=${activeUuid.value}`)
    
    if (status.resolved) {
      clearInterval(pollInterval)
      showModal.value = false
      
      if (status.signed) {
        console.log('signed')
        if (!account.value && status.account) {
          account.value = status.account
        }
        if (status.txHash && isPayment.value) { 
          txHash.value = status.txHash
        }
      } else {
        alert('Transaction rejected by user')
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const closeModal = () => {
  showModal.value = false
  clearInterval(pollInterval)
  activeUuid.value = ''
}
</script>