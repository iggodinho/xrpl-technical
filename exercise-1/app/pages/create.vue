app/pages/create.vue
<template>
  <div class="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-blue-900 mb-8">Create Clock NFT</h1>

    <div class="w-full max-w-md mb-8">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Select a Clock
      </label>
      <select 
        v-model="selectedId" 
        @change="handleSelect"
        class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="" disabled selected>Choose a clock...</option> <!--padrao deixar o valor inicial vazio e como disabled-->
        <option v-for="clock in clocks" :key="clock.id" :value="clock.id">
          {{ clock.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedClock" class="flex flex-col items-center gap-6">
      <div class="bg-white p-4 rounded-xl shadow-lg">
        <img 
          :src="selectedClock.imageUrl" 
          :alt="selectedClock.name" 
          class="w-full max-w-md h-auto rounded-lg"
        />
        <p class="mt-2 text-center text-gray-600 font-semibold">{{ selectedClock.name }}</p>
      </div>

      <Button @click="createNFT" :disabled="isLoading">
        {{ isLoading ? 'Creating...' : 'Generate NFT' }}
      </Button>
    </div>

    <Modal 
      :show="showModal" 
      header="NFT created successfully!" 
      @close="showModal = false"
    >
      <p class="mb-4">Your NFT for {{ selectedClock.name }} has been generated. </p>
      <img 
          :src="selectedClock.imageUrl" 
          :alt="selectedClock.name" 
          class="w-full max-w-md h-auto rounded-lg mb-4"
        />
      <a 
        :href="explorerLink" 
        target="_blank" 
        class="text-blue-600 hover:text-blue-800 underline break-all"
      >
        View on XRPL Explorer
      </a>
    </Modal>
  </div>
</template>

<script setup lang="ts">
const { clocks, selectedClock, selectClock } = useClock()
const selectedId = ref(selectedClock.value?.id || '')
const isLoading = ref(false)
const showModal = ref(false)
const explorerLink = ref('')

const handleSelect = () => {
  const selected = clocks.value.find(c => c.id === selectedId.value) //pega o clock na minha lista de clocks usando o id selecionado
  selectClock(selected)
}

const createNFT = async () => {
  if (!selectedClock.value) return;
  isLoading.value = true;
  try {
    const result = await mintNft(selectedClock.value.imageUrl);
    if (result.success) {
      explorerLink.value = result.explorerLink;
      showModal.value = true;
    }
  } catch (error) {
    alert('ERROR');
  } finally {
    isLoading.value = false;
  }
}

</script>