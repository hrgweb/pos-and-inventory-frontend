import { defineStore } from 'pinia'
import { usePageStore } from '@/store/page'
import { useToast } from 'primevue/usetoast'
import type { Errors } from '@/types/errors'
import { useConfirm } from 'primevue/useconfirm'
import type { TransactionSession } from '@/types/interface/transactionSession'
import type { Product } from '@/types/interface/inventory'
import { OrderStatus, type Order } from '@/types/interface/order'
import type { Sale, SaleResult } from '@/types/interface/sale'

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
  const lookupItems = ref<Product[]>([])
  const payError = ref(false)
  const payErrorMsg = ref('')

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

  function openVoid(transactionSessionNo: string | undefined): void {
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

          // start new transaction
          newTransaction()
        } catch (error: any) {
          Object.assign(err, error?.data)
        } finally {
          deleting.value = false
        }
      }
    })
  }

  type Buttons = {
    btnTransaction: boolean
    btnLookup: boolean
    btnPay: boolean
    btnVoid: boolean
  }

  let actionButtons = ref<Buttons>({
    btnTransaction: true,
    btnLookup: true,
    btnPay: true,
    btnVoid: true
  })

  function toggleStateOfButtons(state: boolean): void {
    actionButtons.value.btnTransaction = state
    actionButtons.value.btnLookup = state
    actionButtons.value.btnPay = state
    actionButtons.value.btnVoid = state
  }

  async function newTransaction(): Promise<void> {
    try {
      const session = (await $fetch(
        `${useBackendUrl()}/api/transaction-sessions`,
        {
          method: 'POST'
        }
      )) as TransactionSession

      page.transactionSession = session
      blocked.value = false

      localStorage.setItem(
        'transaction_session_no',
        page.transactionSession?.session_no
      )

      useDashboardData() // fetch data
      toggleStateOfButtons(false)
    } catch (error: any) {
      console.log(error?.data)
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

  const searchByProductOrBarcode = ref('')
  const isLookupLoading = ref(false)

  async function searchProduct(): Promise<void> {
    if (searchByProductOrBarcode.value.length <= 0) {
      return
    }

    // reset errors
    payError.value = false
    payErrorMsg.value = ''

    isLookupLoading.value = true

    try {
      const products = (await $fetch(`${useBackendUrl()}/api/products/lookup`, {
        query: {
          search: searchByProductOrBarcode.value
        }
      })) as Product[]

      lookupItems.value = products
    } catch (error: any) {
      console.log(error.data)
    }

    isLookupLoading.value = false
  }

  async function findViaEnter(): Promise<void> {
    // no products found
    if (lookupItems.value.length <= 0) return

    if (lookupItems.value.length === 1) {
      let item = lookupItems.value[0] as Product

      const sellingPrice = item?.selling_price
      const qty = 1
      const subtotal = sellingPrice * qty

      try {
        const order = (await $fetch(`${useBackendUrl()}/api/orders`, {
          method: 'POST',
          body: {
            transaction_session_no: page.transactionSession?.session_no,
            product: item,
            selling_price: sellingPrice,
            qty,
            subtotal,
            status: OrderStatus.PENDING
          }
        })) as Order

        showLookup.value = false
        page.orders.push(order)
      } catch (error: any) {
        console.log('err: ', error?.data)
        payError.value = true
        payErrorMsg.value = error?.data?.message
      }
    }
  }

  function rowClickOnItemLookup(e: any) {
    console.log(e.data)
  }

  const sale = reactive<Sale>({
    transaction_session_no: '',
    orders: [],
    grand_total: 0,
    amount: 0,
    product_count_occurences: []
  })
  const isPaid = ref(false)

  async function paid(): Promise<void> {
    if (page.pay.amount < page.pay.grandTotal) {
      payError.value = true
      payErrorMsg.value = 'Amount must be greater than the total.'
      return
    }

    sale.transaction_session_no = page.transactionSession?.session_no
    sale.orders = page.orders
    sale.grand_total = page.pay.grandTotal
    sale.amount = page.pay.amount
    sale.change = page.pay.amount - page.pay.grandTotal
    sale.product_count_occurences = util.countOccurrences(page.orders)

    try {
      const payment = (await $fetch(`${useBackendUrl()}/api/sales`, {
        method: 'POST',
        body: sale
      })) as SaleResult

      if (payment && payment.success) {
        payError.value = false
        payErrorMsg.value = ''
        page.pay.change = page.pay.amount - page.pay.grandTotal
        showPay.value = false
        isPaid.value = true
        // page.orders = []
        toggleStateOfButtons(true)
        actionButtons.value.btnTransaction = false
        blocked.value = true
      }
    } catch (error: any) {
      console.log(error?.data)
    }
  }

  return {
    lookupItems,
    showLookup,
    showPay,
    blocked,
    actionButtons,
    payError,
    payErrorMsg,
    searchByProductOrBarcode,
    isLookupLoading,
    openLookup,
    openPay,
    openVoid,
    orderRemove,
    newTransaction,
    toggleStateOfButtons,
    rowClickOnItemLookup,
    searchProduct,
    findViaEnter,
    paid
  }
})
