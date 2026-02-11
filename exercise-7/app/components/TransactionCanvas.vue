<template>
  <div class="relative w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>
    
    <div class="absolute top-4 left-4 bg-black/60 p-3 rounded-lg backdrop-blur-sm text-xs text-white space-y-2 pointer-events-none select-none">
        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-green-500"></span> Payment</div>
        <div class="flex items-center gap-2"><span class="w-3 h-3 bg-blue-500"></span> OfferCreate</div>
        <div class="flex items-center gap-2"><span class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-orange-500"></span> Config (Trust/Account)</div>
        <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-gray-500"></span> Others</div>
        <div class="mt-2 pt-2 border-t border-gray-600 text-gray-400">
            Batch Count: {{ transactions.length }}
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  transactions: any[]
}>()

const canvasRef = ref(null)
let ctx= null
const isMounted = ref(false)

const getType = (tx) => {
    return tx.transaction?.TransactionType || 
           tx.tx_json?.TransactionType || 
           tx.TransactionType || 
           'Unknown';
}

const playBeep = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(0.3);
    } catch (e) {
    }
}

const drawBatch = () => {
  if (!isMounted.value || !canvasRef.value || !ctx) return
  
  const { width, height } = canvasRef.value
  
  if (width === 0 || height === 0) return
  ctx.clearRect(0, 0, width, height)

  if (props.transactions.length === 0) return

  playBeep()

  props.transactions.forEach((tx) => {
    const x = Math.random() * (width - 40) + 20
    const y = Math.random() * (height - 40) + 20
    
    const type = getType(tx)

    ctx!.beginPath()

    if (type === 'Payment') {
        ctx!.fillStyle = '#22c55e' 
        ctx!.arc(x, y, 10, 0, Math.PI * 2)
        ctx!.fill()
    } else if (type === 'OfferCreate' || type === 'OfferCancel') {
        ctx!.fillStyle = '#3b82f6'
        ctx!.fillRect(x - 10, y - 10, 20, 20)
    } else if (['TrustSet', 'AccountSet', 'SetRegularKey'].includes(type)) {
        ctx!.fillStyle = '#f97316'
        ctx!.moveTo(x, y - 10)
        ctx!.lineTo(x + 10, y + 10)
        ctx!.lineTo(x - 10, y + 10)
        ctx!.fill()
    } else {
        ctx!.fillStyle = '#6b7280'
        ctx!.arc(x, y, 6, 0, Math.PI * 2)
        ctx!.fill()
    }
    ctx!.shadowBlur = 10;
    ctx!.shadowColor = ctx!.fillStyle as string;
  })
  ctx!.shadowBlur = 0;
}

const resizeCanvas = () => {
    if (canvasRef.value && isMounted.value) {
        canvasRef.value.width = canvasRef.value.offsetWidth
        canvasRef.value.height = canvasRef.value.offsetHeight
        ctx = canvasRef.value.getContext('2d')
    }
}

onMounted(() => {
  isMounted.value = true 
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
    isMounted.value = false 
    window.removeEventListener('resize', resizeCanvas)
})

watch(() => props.transactions, () => {
    if (isMounted.value) {
        requestAnimationFrame(() => {
            if (isMounted.value) drawBatch()
        })
    }
}, { deep: true })
</script>