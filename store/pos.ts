import { defineStore } from 'pinia'
import { usePageStore } from '@/store/page'
import { useToast } from 'primevue/usetoast'

export const usePosStore = defineStore('pos', () => {
  const page = usePageStore()
  const toast = useToast()

  const showLookup = ref(false)
  const showPay = ref(false)

  async function openLookup(): Promise<void> {
    showLookup.value = !showLookup.value
    await nextTick()
    document.getElementById('search')?.focus()
  }

  async function openPay(): Promise<void> {
    await nextTick()

    if (!page.orders.length) {
      toast.add({
        severity: 'warn',
        summary: 'No orders',
        detail: 'No orders for this transaction.',
        life: 3000
      })
      return
    }

    const payButton = document.getElementById('pay') as HTMLButtonElement
    if (payButton?.disabled) {
      toast.add({
        severity: 'warn',
        summary: 'Message',
        detail: 'The transaction for this session was already completed.',
        life: 3000
      })
      return
    }

    showPay.value = !showPay.value
    document.getElementById('amount')?.focus()
  }

  return { showLookup, showPay, openLookup, openPay }
})
