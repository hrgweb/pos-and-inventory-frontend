import { defineStore } from 'pinia'
import { usePageStore } from '@/store/page'
import { useToast } from 'primevue/usetoast'
import type { Order } from '@/types/interface/order'
import type { Errors } from '@/types/errors'

export const usePosStore = defineStore('pos', () => {
  const page = usePageStore()
  const toast = useToast()

  const showLookup = ref(false)
  const showPay = ref(false)
  const removing = ref(false)
  let err: Errors = reactive({
    errors: {},
    message: ''
  })
  const blocked = ref(false)

  async function openLookup(): Promise<void> {
    const lookupButton = document.getElementById('lookup') as HTMLButtonElement
    if (lookupButton?.disabled) {
      return
    }

    showLookup.value = !showLookup.value
    await nextTick()
    document.getElementById('search')?.focus()
  }

  async function openPay(): Promise<void> {
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
      // toast.add({
      //   severity: 'warn',
      //   summary: 'Message',
      //   detail: 'This transaction was completed already.',
      //   life: 3000
      // })
      return
    }

    showPay.value = !showPay.value
    await nextTick()
    document.getElementById('amount')?.focus()
  }

  async function openVoid(): Promise<void> {
    const lookupButton = document.getElementById('void') as HTMLButtonElement
    if (lookupButton?.disabled) {
      return
    }
  }

  async function orderRemove(data: any, index: number): Promise<void> {
    removing.value = true

    try {
      const deleted = (await $fetch<unknown>(
        `${useBackendUrl()}/api/orders/${data?.id}`,
        { method: 'DELETE', body: { name: data?.product?.name } }
      )) as Order

      if (deleted) {
        if (page.orders?.length) {
          page.orders.splice(index, 1)
        }
      }
    } catch (error: any) {
      Object.assign(err, error?.data)
    } finally {
      removing.value = false
    }
  }

  return { showLookup, showPay, blocked, openLookup, openPay, openVoid, orderRemove }
})
