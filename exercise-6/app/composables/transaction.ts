export const useXamanTransaction = () => {
  const showModal = ref(false)
  const showSuccessModal = ref(false)
  const qrUrl = ref('')
  const activeUuid = ref('')
  const txHash = ref('')
  let pollInterval: any = null

  const checkStatus = async () => {
    if (!activeUuid.value) return
    try {
      const status = await $fetch(`/api/check?uuid=${activeUuid.value}`)
      if (status.resolved) {
        stopPolling() 
        showModal.value = false
        if (status.signed) {
          txHash.value = status.txHash || ''
          showSuccessModal.value = true
        } else {
          alert('Transaction rejected')
        }
      }
    } catch (e) { console.error('Polling error:', e) }
  }

  const startPolling = (uuid: string, url: string) => {
    activeUuid.value = uuid
    qrUrl.value = url
    showModal.value = true
    if (pollInterval) clearInterval(pollInterval)
    pollInterval = setInterval(checkStatus, 2000)
  }

  const stopPolling = () => {
    if (pollInterval) clearInterval(pollInterval)
  }

  const closeModal = () => {
    showModal.value = false
    showSuccessModal.value = false
    stopPolling()
    activeUuid.value = ''
    qrUrl.value = ''
  }

  return { showModal, showSuccessModal, qrUrl, txHash, startPolling, stopPolling, closeModal }
}