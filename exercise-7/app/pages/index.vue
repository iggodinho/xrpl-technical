<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-8">
    <div class="w-full max-w-5xl">
      <div class="flex justify-between items-end mb-8">
        <div>
            <h1 class="text-3xl font-bold text-blue-900">XRPL Live Monitor</h1>
            <p class="text-gray-600">Real-time Transaction Visualization</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <div :class="`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`"></div>
            <span class="font-medium text-gray-700">
                Status: {{ isConnected ? 'Connected to Testnet' : 'Disconnected' }}
            </span>
        </div>
        
        <Button 
            @click="toggleConnection" 
            :class="isConnected ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'"
        >
            {{ isConnected ? 'Stop Feed' : 'Start Live Feed' }}
        </Button>
      </div>

      <div v-if="isConnected" class="fade-in">
        <TransactionCanvas :transactions="currentBatch" />
        <p class="text-center text-sm text-gray-500 mt-4">
            Updating every 4 seconds... (Beep enabled)
        </p>
      </div>

      <div v-else class="h-[500px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
        Click "Start Live Feed" to connect to WebSocket
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { connectAndListen, disconnect, isConnected, currentBatch } = useTransactions()

const toggleConnection = () => {
    if (isConnected.value) {
        disconnect()
    } else {
        connectAndListen()
    }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>