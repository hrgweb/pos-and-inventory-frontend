<template>
  <div class="grid" style="height: 100vh">
    <div class="col-9" style="background-color: #f5f8fa">
      <div id="order-wrapper" style="height: 79vh">
        <DataTable
          scrollable
          scrollHeight="79vh"
          :value="page.orders"
          tableClass="orders"
        >
          <Column field="product.name" header="Product"></Column>
          <Column field="product.selling_price" header="Price"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="subtotal" header="Subtotal"></Column>
        </DataTable>
      </div>
      <div class="bill px-3">
        <div class="flex justify-content-between pt-4 pb-2">
          <span class="text-4xl font-bold uppercase">Total</span>
          <span class="text-4xl font-bold">{{
            transactionSession?.grand_total
          }}</span>
        </div>
        <div class="flex justify-content-between pb-2">
          <span class="text-2xl font-bold uppercase">Amount</span>
          <span class="text-2xl font-bold">{{
            transactionSession?.amount
          }}</span>
        </div>
        <div class="flex justify-content-between">
          <span class="text-2xl font-bold uppercase">Change</span>
          <span class="text-2xl font-bold">{{
            transactionSession?.change
          }}</span>
        </div>
      </div>
    </div>

    <div class="col-3 py-3">
      <!-- <div class="products flex">
        <div
          v-for="product in products"
          :key="product.id"
          class="item flex align-items-center relative"
          style="cursor: pointer"
          @click="selectItem(product)"
        >
          <span>{{ product?.name }}</span>

          <span
            class="text-center absolute"
            style="
              bottom: 0.5em;
              background-color: green;
              padding: 0 1rem;
              border-radius: 50px;
            "
            >123</span
          >
        </div>
      </div> -->

      <div class="actions relative" style="height: 100%">
        <Button label="New Transaction" @click="newTransaction" />
        <Button
          label="Lookup"
          :disabled="actionButtons.btnLookup"
          @click="openLookup"
        />

        <!-- Pay Now-->
        <Button
          label="Pay"
          class="absolute"
          style="bottom: 0; left: 0"
          severity="info"
          :disabled="actionButtons.btnPay"
          @click="payment"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="showLookup"
      modal
      header="ITEM LOOKUP"
      :style="{ width: '60rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent>
        <div class="flex flex-column gap-2">
          <span class="p-input-icon-left p-input-icon-right w-full">
            <i class="pi pi-search" />
            <InputText
              type="text"
              v-model="searchByProductOrBarcode"
              class="w-full"
              id="search"
              placeholder="Type product name or scan barcode"
              @input="findByProductOrBarcodeFn"
              @keyup.enter="findViaEnter"
            />
            <i class="pi pi-qrcode" />
          </span>
        </div>
      </form>
      <br />

      <DataTable
        :value="lookupItems"
        tableStyle="min-width: 50rem"
        :loading="isLookupLoading"
        stripedRows
      >
        <template #empty>
          <p class="text-center">No results found</p>
        </template>
        <Column field="barcode" header="Barcode"></Column>
        <Column field="name" header="Product Name"></Column>
        <Column field="selling_price" header="Selling Price"></Column>
        <Column field="is_available" header="Available"></Column>
      </DataTable>
    </Dialog>

    <Dialog
      v-model:visible="showPay"
      modal
      header="AMOUNT"
      :style="{ width: '35rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent>
        <Message
          v-if="payError"
          class="mt-0"
          :closable="false"
          severity="warn"
          >{{ payErrorMsg }}</Message
        >

        <InputText
          id="amount"
          class="text-3xl font-bold uppercase w-full"
          v-model.number="pay.amount"
          @keyup.enter="paid"
        />
      </form>
    </Dialog>

    <Toast position="top-left" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Product } from '@/types/interface/inventory'
import { OrderStatus, type Order } from '@/types/interface/order'
import type { Pay, Sale, SaleResult } from '@/types/interface/sale'
import { useToast } from 'primevue/usetoast'
import type { TransactionSession } from '~/types/interface/transactionSession'
import { usePageStore } from '@/store/page'

const page = usePageStore()
const toast = useToast()

definePageMeta({ layout: false })

const searchByProductOrBarcode = ref('')
const showLookup = ref(false)
const isLookupLoading = ref(false)
const lookupItems = ref<Product[]>([])
const showPay = ref(false)
const pay = reactive<Pay>({
  grandTotal: 0,
  amount: 0,
  change: 0
})

const transactionSession = computed(() => page.transactionSession)

watch(
  [() => page.orders, () => page.transactionSession],
  async ([orders, transactionSession]) => {
    // orders
    if (orders?.length) {
      pay.grandTotal = grandTotal()
      await nextTick()
      import.meta.client && scrollToBottom()
    }

    // transactionSession
    if (!transactionSession) {
      toggleStateOfButtons(true)
      actionButtons.value.btnTransaction = false
      return
    }

    toggleStateOfButtons(false)

    // disable pay button when transaction is completed
    if (transactionSession?.status === 'completed') {
      actionButtons.value.btnPay = true
    }
  },
  {
    deep: true
  }
)

onMounted(() => useDashboardData())

const findByProductOrBarcodeFn = useDebounceFn(async () => {
  if (searchByProductOrBarcode.value.length <= 0) {
    return
  }

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
}, 500)

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
      console.log('err: ', error)
    }
  }
}

function grandTotal(): number {
  if (page.orders.length > 0) {
    return page.orders.reduce((acc, order) => {
      const subtotal = order?.subtotal || 0

      return acc + subtotal
    }, 0)
  }

  return 0
}

function scrollToBottom() {
  const scrollingContainer = document.getElementsByClassName(
    'p-datatable-wrapper'
  )[0]

  if (scrollingContainer) {
    scrollingContainer.scrollTop = scrollingContainer.scrollHeight
  }
}

async function openLookup(): Promise<void> {
  showLookup.value = true
  await nextTick()
  document.getElementById('search')?.focus()
}

const payError = ref(false)
const payErrorMsg = ref('')
const isPaid = ref(false)

function payment(): void {
  if (!page.orders.length) {
    toast.add({
      severity: 'warn',
      summary: 'No orders',
      detail: 'No orders for this transaction.',
      life: 3000
    })
    return
  }

  showPay.value = true
}

const sale = reactive<Sale>({
  transaction_session_no: '',
  orders: [],
  grand_total: 0,
  amount: 0
})

async function paid(): Promise<void> {
  if (pay.amount < pay.grandTotal) {
    payError.value = true
    payErrorMsg.value = 'Amount must be greater than the total.'
    return
  }

  sale.transaction_session_no = page.transactionSession?.session_no
  sale.orders = page.orders
  sale.grand_total = pay.grandTotal
  sale.amount = pay.amount
  sale.change = pay.amount - pay.grandTotal

  try {
    const payment = (await $fetch(`${useBackendUrl()}/api/sales`, {
      method: 'POST',
      body: sale
    })) as SaleResult

    if (payment && payment.success) {
      payError.value = false
      payErrorMsg.value = ''
      pay.change = pay.amount - pay.grandTotal
      showPay.value = false
      isPaid.value = true
      // page.orders = []
      toggleStateOfButtons(false)
    }
  } catch (error: any) {
    console.log(error?.data)
  }
}

type Buttons = {
  btnTransaction?: boolean
  btnLookup: boolean
  btnPay: boolean
}

let actionButtons = ref<Buttons>({
  btnLookup: true,
  btnPay: true
})

function toggleStateOfButtons(state: boolean): void {
  actionButtons.value.btnTransaction = state
  actionButtons.value.btnLookup = state
  actionButtons.value.btnPay = state
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

    localStorage.setItem(
      'transaction_session_no',
      page.transactionSession?.session_no
    )

    useDashboardData() // fetch data
  } catch (error: any) {
    console.log(error?.data)
  }
}
</script>

<style lang="scss">
.orders {
  height: 100%;
}

.products {
  flex-wrap: wrap;
}

.item {
  width: 170px;
  flex: 1;
  flex-basis: 180px;
  height: 130px;
  justify-content: center;
  background-color: #f1f3f4;
  border-radius: 10px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.actions {
  button {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.bill {
  span {
    color: rgb(65, 64, 64) !important;
  }
}
</style>
