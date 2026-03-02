components/Modal.vue

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
      <h3 class="text-xl font-bold mb-4 text-gray-800">{{ header }}</h3>
      
      <div class="mb-6 text-gray-600">
        <slot />
      </div>

      <div class="flex justify-end gap-2">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  show: boolean
  header: string
}>()

defineEmits(['close'])
</script>