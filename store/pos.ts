import { defineStore } from 'pinia'
import { usePageStore } from '@/store/page'
import { useToast } from 'primevue/usetoast'
import type { Order } from '@/types/interface/order'
import type { Errors } from '@/types/errors'
import { useConfirm } from 'primevue/useconfirm'

export const usePosStore = defineStore('pos', () => {
  const page = usePageStore()
  const toast = useToast()
  const confirm = useConfirm()

  const showLookup = ref(false)
  const showPay = ref(false)
  const removing = ref(false)
  const deleting = ref(false)
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

  function openVoid(
    transactionSessionNo: string | undefined,
  ): void {
    const lookupButton = document.getElementById('void') as HTMLButtonElement
    if (lookupButton?.disabled) {
      return
    }

    confirm.require({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        deleting.value = true

        try {
          const deleted = (await $fetch<unknown>(
            `${useBackendUrl()}/api/transactions/void`,
            {
              method: 'DELETE',
              body: {
                transaction_session_no: transactionSessionNo
              }
            }
          )) as Order

          if (deleted) {
            page.orders = []
          }
        } catch (error: any) {
          Object.assign(err, error?.data)
        } finally {
          deleting.value = false
        }
      }
    })
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

  return {
    showLookup,
    showPay,
    blocked,
    openLookup,
    openPay,
    openVoid,
    orderRemove
  }
})
