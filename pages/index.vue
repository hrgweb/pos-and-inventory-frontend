<template>
  <div class="grid">
    <div class="col-5" style="background-color: #f5f8fa">
      <div style="height: 70vh; overflow-y: auto">
        <DataTable :value="orders" tableClass="orders">
          <Column field="product_name" header="Product"></Column>
          <Column field="selling_price" header="Price"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="subtotal" header="Subtotal"></Column>
        </DataTable>
      </div>
      <div class="bill px-3">
        <div class="flex justify-content-between pb-2 pt-3">
          <span class="text-2xl">Discount</span>
          <span class="text-2xl font-bold">120</span>
        </div>
        <div class="flex justify-content-between pb-2">
          <span class="text-2xl">VAT</span>
          <span class="text-2xl font-bold">80</span>
        </div>
        <hr />
        <div class="flex justify-content-between pt-3">
          <span class="text-3xl">Total</span>
          <span class="text-3xl font-bold">380</span>
        </div>
      </div>
    </div>

    <div class="col-7 px-4">
      <div class="pb-3">
        <span class="p-input-icon-left p-input-icon-right w-full">
          <i class="pi pi-search" />
          <InputText
            type="text"
            v-model="searchByProductOrBarcode"
            class="w-full"
            placeholder="Type product name or scan barcode"
            @keyup="findByProductOrBarcode"
          />
          <i class="pi pi-qrcode" />
        </span>
      </div>

      <div class="products flex">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const config = useRuntimeConfig()

onMounted(() => {
  data()
})

const products = ref([])
const transactionSession = ref('')

async function data() {
  try {
    const result = await $fetch(`${config.public.backendUrl}/api/data`)

    products.value = result?.products
    transactionSession.value = result?.transaction_session

    return result
  } catch (error) {
    console.log(error.data)
  }
}

const selectedProduct = ref({})
const orders = ref([])

async function selectItem(product) {
  selectedProduct.value = product

  try {
    const order = await $fetch(`${config.public.backendUrl}/api/orders`, {
      method: 'POST',
      body: {
        order_transaction_session: transactionSession.value,
        product_id: product?.id,
        product_name: product?.name,
        product_description: product?.description,
        qty: product?.qty,
        selling_price: product?.selling_price
      }
    })

    orders.value.push(order)

    return order
  } catch (error) {
    console.log(error.data)
  }
}

const searchByProductOrBarcode = ref('')

const findByProductOrBarcode = useDebounceFn(async () => {
  const { data } = await useFetch(
    `${config.public.backendUrl}/api/products/${searchByProductOrBarcode.value}`
  )

  console.log(data)
}, 700)
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
</style>
