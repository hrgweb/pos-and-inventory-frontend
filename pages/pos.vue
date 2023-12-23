<template>
  <div class="grid" style="height: 100vh">
    <div class="col-9" style="background-color: #f5f8fa">
      <div id="order-wrapper" style="height: 70vh">
        <DataTable
          scrollable
          scrollHeight="55vh"
          :value="orders"
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
          <span class="text-4xl font-bold">{{ pay.grandTotal }}</span>
        </div>
        <div class="flex justify-content-between pb-2">
          <span class="text-2xl font-bold uppercase">Amount</span>
          <span class="text-2xl font-bold">{{ pay.amount }}</span>
        </div>
        <div class="flex justify-content-between">
          <span class="text-2xl font-bold uppercase">Change</span>
          <span class="text-2xl font-bold">{{ pay.change }}</span>
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
        <Button label="New Transaction" />
        <Button label="Lookup" @click="openLookup" />

        <!-- Pay Now-->
        <Button
          label="Pay"
          class="absolute"
          style="bottom: 0; left: 0"
          severity="info"
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
        <Message v-if="payError" :closable="false" severity="warn">{{
          payErrorMsg
        }}</Message>

        <InputText
          id="amount"
          class="text-3xl font-bold uppercase w-full"
          v-model.number="pay.amount"
          @keyup.enter="paid"
        />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Product } from '@/types/interface/inventory'
import { OrderStatus, type Order } from '@/types/interface/order'

const config = useRuntimeConfig()

definePageMeta({
  layout: false
})

type Pay = {
  grandTotal: number
  amount: number
  change: number
}

const transactionSessionNo = ref('')
const orders = ref<Order[]>([])
const suppliers = ref([])
const searchByProductOrBarcode = ref('')
const showLookup = ref(false)
const isLookupLoading = ref(false)
const lookupItems = ref<Product[]>([])
const showPay = ref(true)
const pay = ref<Pay>({
  grandTotal: 0,
  amount: 0,
  change: 0
})

watch(
  () => orders,
  async () => {
    pay.value.grandTotal = grandTotal()
    await nextTick()
    process?.client && scrollToBottom()
  },
  { immediate: true, deep: true }
)

type Data = {
  transaction_session_no: string
  orders: []
  suppliers: []
}

onMounted(() => data())

async function data(): Promise<void> {
  try {
    const data = (await $fetch(`${config.public.backendUrl}/api/data`)) as Data

    transactionSessionNo.value = data?.transaction_session_no
    orders.value = data?.orders
    suppliers.value = data?.suppliers
  } catch (error: any) {
    console.log(error.data)
  }
}

const findByProductOrBarcodeFn = useDebounceFn(async () => {
  if (searchByProductOrBarcode.value.length <= 0) {
    return
  }

  isLookupLoading.value = true

  try {
    const products = (await $fetch(
      `${config.public.backendUrl}/api/products/lookup`,
      {
        query: {
          search: searchByProductOrBarcode.value
        }
      }
    )) as Product[]

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

    showLookup.value = false

    try {
      const order = (await $fetch(`${config.public.backendUrl}/api/orders`, {
        method: 'POST',
        body: {
          transaction_session_no: transactionSessionNo.value,
          product: item,
          selling_price: sellingPrice,
          qty,
          subtotal,
          status: OrderStatus.PENDING
        }
      })) as Order

      orders.value.push(order)
    } catch (error: any) {
      console.log(error?.data)
    }
    return
  }
}

function grandTotal(): number {
  if (orders.value.length > 0) {
    return orders.value.reduce((acc, order) => {
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

function payment(): void {
  showPay.value = true
}

function paid(): void {
  if (pay.value.amount < pay.value.grandTotal) {
    payError.value = true
    payErrorMsg.value = 'Amount must be greater than the total.'
    return
  }

  payError.value = false
  payErrorMsg.value = ''
  pay.value.change = pay.value.amount - pay.value.grandTotal
  showPay.value = false
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
</style>
