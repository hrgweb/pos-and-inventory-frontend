<template>
  <div class="grid">
    <div class="col-9" style="background-color: #f5f8fa">
      <div id="order-wrapper" style="height: 85vh">
        <DataTable
          scrollable
          scrollHeight="85vh"
          :value="orders"
          tableClass="orders"
        >
          <Column field="product_name" header="Product"></Column>
          <Column field="selling_price" header="Price"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="subtotal" header="Subtotal"></Column>
        </DataTable>
      </div>
      <div class="bill px-3">
        <!-- <div class="flex justify-content-between pb-2 pt-3">
          <span class="text-2xl">Discount</span>
          <span class="text-2xl font-bold">120</span>
        </div> -->
        <!-- <div class="flex justify-content-between pb-2">
          <span class="text-2xl">VAT</span>
          <span class="text-2xl font-bold">80</span>
        </div> -->
        <!-- <hr /> -->
        <div class="flex justify-content-between py-4">
          <span class="text-4xl">Total</span>
          <span class="text-4xl font-bold">{{ total }}</span>
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

      <div class="actions">
        <Button label="New Transaction" />
        <Button label="Lookup" @click="showLookup = true" />
      </div>
    </div>

    <Dialog
      v-model:visible="showLookup"
      modal
      header="Item Lookup"
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

const transactionSessionNo = ref('')
const orders = ref<Order[]>([])
const suppliers = ref([])
const total = ref(0)
const searchByProductOrBarcode = ref('')
const showLookup = ref(false)
const isLookupLoading = ref(false)
const lookupItems = ref<Product[]>([])

// watch(
//   () => orders,
//   async () => {
//     total.value = grandTotal()
//     await nextTick()
//     process?.client && scrollToBottom()
//   },
//   { immediate: true, deep: true }
// )

type Data = {
  transaction_session_no: string
  orders: []
  suppliers: []
}

onMounted(() => {
  data()
})

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

// const selectedProduct = ref({})

// async function selectItem(product) {
//   selectedProduct.value = product

//   try {
//     const order = await $fetch(`${config.public.backendUrl}/api/orders`, {
//       method: 'POST',
//       body: {
//         order_transaction_session: transactionSessionNo.value,
//         product_id: product?.id,
//         product_name: product?.name,
//         product_description: product?.description,
//         qty: product?.qty,
//         selling_price: product?.selling_price
//       }
//     })

//     orders.value.push(order)

//     return order
//   } catch (error) {
//     console.log(error.data)
//   }
// }

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

function findViaEnter(): void {
  if (lookupItems.value.length) {
    const item = lookupItems.value[0] as Product

    orders.value.push({
      product: item,
      status: OrderStatus.PENDING
    })

    showLookup.value = false
  }
}

// function grandTotal() {
//   if (orders.value.length > 0) {
//     return orders.value.reduce((acc, order) => {
//       const subtotal = order?.subtotal || 0

//       return acc + subtotal
//     }, 0)
//   }
// }

// function scrollToBottom() {
//   const scrollingContainer = document.getElementsByClassName(
//     'p-datatable-wrapper'
//   )[0]

//   if (scrollingContainer) {
//     scrollingContainer.scrollTop = scrollingContainer.scrollHeight
//   }
// }
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
