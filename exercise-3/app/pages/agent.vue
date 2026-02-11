<template>
  <div class="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-blue-900 mb-8">Evaluate your Idea</h1>

    <div class="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
      <label class="block text-gray-700 font-bold mb-2">
        Describe your business idea:
      </label>
      
      <textarea 
        v-model="idea"
        rows="6"
        class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 
        focus:ring-blue-500 focus:outline-none mb-6 resize-none text-gray-800"
      ></textarea>

      <div class="flex justify-end">
        <Button @click="submitIdea" :disabled="isLoading || !idea">
          {{ isLoading ? 'Thinking...' : 'Send Idea' }}
        </Button>
      </div>
    </div>

    <div v-if="score !== null" class="mt-8 fade-in">
      <div class="bg-white p-8 rounded-full h-32 w-32 flex items-center justify-center shadow-xl border-4">
        <span class="text-4xl font-black text-gray-800">{{ score }}/10</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const idea = ref('')
const isLoading = ref(false)
const score = ref(null)

const submitIdea = async () => {
  if (!idea.value) return
  isLoading.value = true
  score.value = null
  try {
    const data = await $fetch('/api/openai', {
      method: 'POST',
      body: { idea: idea.value }
    })
    score.value = data.score
  } catch (error) {
    alert('error')
  } finally {
    isLoading.value = false
  }
}
</script>

