<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Inventory</h3>
      <div class="actions pb-3">
        <Button
          label="New Product"
          severity="primary"
          @click="showDialog = true"
        />
      </div>
    </div>

    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="search" placeholder="Search" />
        </span>
      </template>
      <Column field="barcode" header="Barcode"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="description" header="Description"></Column>
      <!-- <Column field="brand_id" header="Brand"></Column> -->
      <!-- <Column field="supplier_id" header="Supplier"></Column> -->
      <Column field="cost_price" header="Cost Price"></Column>
      <Column field="selling_price" header="Selling Price"></Column>
      <Column field="stock_qty" header="Stock Qty"></Column>
      <Column field="reorder_level" header="Reorder Level"></Column>
      <Column field="is_available" header="Available"></Column>
      <Column header="Created">
        <template #body="slotProps">
          <span>{{
            dayjs(slotProps.data?.created_at).format('MM-DD-YYYY')
          }}</span>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="showDialog"
      modal
      header="New Product"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent="store">
        <div class="flex flex-column gap-2">
          <label for="name">Product Name</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="desc">Product Description</label>
          <InputText id="desc" v-model="form.product.description" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="category">Category Id</label>
          <InputText id="category" v-model.number="form.product.category_id" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="brand">Brand Id</label>
          <InputText id="brand" v-model.number="form.product.brand_id" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="supplier">Supplier Id</label>
          <InputText id="supplier" v-model.number="form.product.supplier_id" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="cost">Cost Price</label>
          <InputText id="cost" v-model.number="form.product.cost_price" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="selling">Selling Price</label>
          <InputText id="selling" v-model.number="form.product.selling_price" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="stock">Stock Qty</label>
          <InputText id="stock" v-model.number="form.product.stock_qty" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="reorder">Reorder Level</label>
          <InputText id="reorder" v-model.number="form.product.reorder_level" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="barcode">Barcode</label>
          <InputText id="barcode" v-model="form.product.barcode" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="transaction_type">Transaction Type</label>
          <InputText id="transaction_type" v-model="form.transaction_type" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="qty">Qty Change</label>
          <InputText id="qty" v-model.number="form.qty_change" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="unit">Unit Cost</label>
          <InputText id="unit" v-model.number="form.unit_cost" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="total">Total Cost</label>
          <InputText id="total" v-model.number="form.total_cost" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="notes">Notes</label>
          <InputText id="notes" v-model="form.notes" />
        </div>
        <br />

        <Button label="Save" type="submit" />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

interface Product {
  name: string
  description: string
  category_id: number
  brand_id: number
  supplier_id: number
  cost_price: number
  selling_price: number
  stock_qty: number
  reorder_level: number
  barcode: string
  created_at?: Date
}

interface Inventory {
  transaction_type: string
  qty_change: number
  unit_cost: number
  total_cost: string
  notes: string
  product: Product
}

type Pagination = {
  data: Product[]
  meta: {}
  links: []
}

const inventory = ref<Inventory[]>([])
const products = ref<Product[]>([])
const showDialog = ref(false)
const isLoading = ref(false)
let form = reactive<Inventory>({
  transaction_type: '',
  qty_change: 0,
  unit_cost: 0,
  total_cost: '',
  notes: '',
  product: {
    name: '',
    description: '',
    category_id: 0,
    brand_id: 0,
    supplier_id: 0,
    cost_price: 0,
    selling_price: 0,
    stock_qty: 0,
    reorder_level: 0,
    barcode: ''
  }
})
const pagination = ref<Pagination>({
  data: [],
  meta: {},
  links: []
})

onMounted(() => fetch())

const config = useRuntimeConfig()

async function fetch(): Promise<void> {
  isLoading.value = true

  try {
    const paginate = (await $fetch(
      `${config?.public?.backendUrl}/api/inventory/products`
    )) as Pagination

    if (inventory) {
      isLoading.value = false
      pagination.value = paginate

      if (paginate?.data?.length) {
        products.value = paginate?.data
      }
    }
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

async function store(): Promise<void> {
  isLoading.value = true

  try {
    const inventory = (await $fetch(
      `${config?.public?.backendUrl}/api/inventory-transactions`,
      {
        method: 'POST',
        body: form
      }
    )) as Inventory

    if (inventory) {
      isLoading.value = false
      products.value?.push(inventory?.product)
      showDialog.value = false
      reset()
    }
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

function reset(): void {
  form.transaction_type = ''
  form.qty_change = 0
  form.unit_cost = 0
  form.total_cost = ''
  form.notes = ''
  form.product.name = ''
  form.product.description = ''
  form.product.category_id = 0
  form.product.brand_id = 0
  form.product.supplier_id = 0
  form.product.cost_price = 0
  form.product.selling_price = 0
  form.product.stock_qty = 0
  form.product.reorder_level = 0
  form.product.barcode = ''
}
</script>
