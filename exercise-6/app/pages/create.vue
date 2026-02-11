<template>
  <div class="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-blue-900 mb-8">Edit & Mint Clock NFT</h1>

    <div class="w-full max-w-md mb-8">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Select a Clock
      </label>
      <select 
        v-model="selectedId" 
        @change="handleSelect"
        class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="" disabled selected>Choose a clock...</option>
        <option v-for="clock in clocks" :key="clock.id" :value="clock.id">
          {{ clock.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedClock" class="flex flex-col items-center gap-6 w-full max-w-2xl">
      <div class="bg-white p-4 rounded-xl shadow-lg w-full flex flex-col items-center">
        <canvas ref="canvasRef" class="hidden"></canvas>
        <img 
          ref="previewImg"
          :src="selectedClock ? `/api/proxy?url=${encodeURIComponent(selectedClock.imageUrl)}` : ''" 
          :alt="selectedClock?.name" 
          class="w-full max-w-md h-auto rounded-lg mb-4 transition-all duration-300"
          :style="{ filter: `brightness(${brightness}%) hue-rotate(${hue}deg)` }"
          crossorigin="anonymous"
          @load="updateCanvas"
        />
        <div class="w-full space-y-4 mt-4">
          <div>
            <label class="text-xs font-bold text-gray-500">Brightness: {{ brightness }}%</label>
            <input type="range" min="0" max="200" v-model="brightness" class="w-full" @input="updateCanvas">
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500">Hue Color: {{ hue }}deg</label>
            <input type="range" min="0" max="360" v-model="hue" class="w-full" @input="updateCanvas">
          </div>
        </div>
      </div>
      <Button @click="createNFT" :disabled="isLoading" class="w-full max-w-xs">
        {{ isLoading ? statusMessage : 'Upload to IPFS & Mint' }}
      </Button>
    </div>
    <Modal 
    :show="showModal" 
    header="Sign with Xaman" 
    @close="closeModal">
      <div class="flex flex-col items-center">
        <div v-if="pinataUrl" class="w-full bg-blue-50 border border-blue-100 p-3 rounded-lg mb-6 text-left">
          <p class="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">
            IPFS Image Created
          </p>
          <a 
            :href="pinataUrl" 
            target="_blank" 
            class="text-xs text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
          >
            {{ pinataUrl }}
            <span class="text-[10px]">↗</span>
          </a>
        </div>
        <p class="mb-4 text-center text-gray-600">Scan to mint your NFT</p>
        <img v-if="qrUrl" :src="qrUrl" class="rounded-lg shadow-sm border p-2 mb-4 w-64 h-64" />
        <p class="text-sm text-gray-400 animate-pulse">Waiting for signature...</p>
      </div>
    </Modal>
    <Modal :show="showSuccessModal" header="NFT Minted!" @close="showSuccessModal = false">
      <div class="text-center">
        <p class="text-green-600 font-bold mb-2">Transaction Successful</p>
        <p class="text-xs text-gray-500 break-all mb-4">{{ txHash }}</p>
        <a :href="`https://testnet.xrpl.org/transactions/${txHash}`" target="_blank" class="text-blue-600 underline">
          View on Explorer
        </a>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
const { clocks, selectedClock, selectClock } = useClock()
const { 
  brightness, hue, canvasRef, previewImg, 
  updateCanvas, resetFilters, getCanvasBlob 
} = useImageEditor()

const { 
  showModal, showSuccessModal, qrUrl, txHash, 
  startPolling, closeModal 
} = useXamanTransaction()

const selectedId = ref('')
const isLoading = ref(false)
const statusMessage = ref('')
const pinataUrl = ref('')

const handleSelect = () => {
  const selected = clocks.value.find(c => c.id === selectedId.value)
  selectClock(selected)
  resetFilters()
}

const createNFT = async () => {
  isLoading.value = true
  statusMessage.value = 'Generating Image...'
  pinataUrl.value = ''
  try {
    const blob = await getCanvasBlob()
    statusMessage.value = 'Uploading to IPFS...'
    const formData = new FormData()
    formData.append('file', blob)

    const uploadData = await $fetch('/api/ipfs', {
      method: 'POST',
      body: formData
    })

    if (!uploadData.success) throw new Error('Upload failed')
    pinataUrl.value = uploadData.pinataLink || uploadData.httpUrl 

    statusMessage.value = 'Preparing Xaman...'
    const mintData = await $fetch('/api/mint-xumm', {
      method: 'POST',
      body: { ipfsUrl: uploadData.url || uploadData.uri } 
    })
    startPolling(mintData.uuid, mintData.qrUrl)

  } catch (error) {
    alert('Error processing request')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>