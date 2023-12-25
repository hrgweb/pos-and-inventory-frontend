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

    <DataTable
      :value="products"
      tableStyle="min-width: 50rem"
      :loading="isLoading"
    >
      <template #header>
        <span class="p-input-icon-left w-5">
          <i class="pi pi-search" />
          <InputText
            v-model="search"
            class="w-full"
            placeholder="Search by product name or barcode"
            @keyup.enter="fetch"
          />
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
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex">
            <Button class="mr-1" label="Edit" severity="warning" size="small" @click="edit(slotProps.data)"/>
            <Button label="Remove" severity="error" size="small" @click="remove"/>
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="10"
      :totalRecords="pagination?.meta?.total"
      template=" PrevPageLink CurrentPageReport NextPageLink"
      @page="paginatorClick"
    ></Paginator>

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
        <!-- <div class="flex flex-column gap-2">
          <label for="category">Category Id</label>
          <InputText id="category" v-model.number="form.product.category_id" />
        </div>
        <br /> -->
        <!-- <div class="flex flex-column gap-2">
          <label for="brand">Brand Id</label>
          <InputText id="brand" v-model.number="form.product.brand_id" />
        </div>
        <br /> -->
        <div class="flex flex-column gap-2">
          <label for="supplier">Supplier Id</label>
          <Dropdown
            v-model="selectedSupplier"
            :options="suppliers"
            optionLabel="name"
            placeholder="Select a supplier"
            class="w-full"
            @change="supplierChosen"
          />
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
          <Dropdown
            v-model="form.transaction_type"
            :options="transactionTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a City"
            class="w-full"
          />
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

        <!-- Errror -->
        <SharedError
          v-if="Object.keys(err.errors as any).length"
          :msg="err?.message"
        />
        <br />

        <Button label="Save" type="submit" :disabled="isFormLoading" />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { PageState } from 'primevue/paginator'
import { transactionTypes } from '@/data/transactionTypes'
import type { Inventory, Product } from '@/types/interface/inventory'
import { TransactionType } from '@/types/enum/transactionType'
import type { Supplier } from '@/types/interface/supplier'
import type { Order } from '@/types/interface/order'
import type { Pagination } from '@/types/pagination'
import type { Errors } from '@/types/errors'

const products = ref<Product[]>([])
const showDialog = ref(false)
const isLoading = ref(false)
const isFormLoading = ref(false)
let form = reactive<Inventory>({
  transaction_type: TransactionType.PURCHASE,
  qty_change: 0,
  unit_cost: 0,
  total_cost: 0,
  notes: '',
  product: {
    name: '',
    description: '',
    // category_id: 0,
    // brand_id: 0,
    supplier_id: 0,
    cost_price: 0,
    selling_price: 0,
    stock_qty: 0,
    reorder_level: 0,
    barcode: ''
  }
})
let formEdit = reactive<Inventory>({
  transaction_type: TransactionType.PURCHASE,
  qty_change: 0,
  unit_cost: 0,
  total_cost: 0,
  notes: '',
  product: {
    name: '',
    description: '',
    // category_id: 0,
    // brand_id: 0,
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
  meta: { total: 0 },
  links: []
})
const curPage = ref(1)
const selectedSupplier = ref({})
let err = ref<Errors>({
  errors: {},
  message: ''
})

onMounted(() => {
  data()
  fetch()
})

interface Data {
  transaction_session: string
  orders: Product[]
  suppliers: Supplier[]
}

const transactionSession = ref('')
const suppliers = ref<Supplier[]>([])
const orders = ref<Order[]>([])

const config = useRuntimeConfig()

async function data(): Promise<void> {
  isLoading.value = true

  try {
    const data = (await $fetch(
      `${config?.public?.backendUrl}/api/data`
    )) as Data

    isLoading.value = false
    transactionSession.value = data?.transaction_session
    orders.value = data?.orders
    suppliers.value = data?.suppliers
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

const search = ref('')

async function fetch(): Promise<void> {
  isLoading.value = true

  try {
    const paginate = (await $fetch(
      `${config?.public?.backendUrl}/api/inventory/products`,
      { query: { page: curPage.value, search: search.value } }
    )) as Pagination

    pagination.value = paginate
    products.value = paginate?.data
  } catch (error) {
    console.log(error)
  }

  isLoading.value = false
}

async function store(): Promise<void> {
  isFormLoading.value = true

  try {
    const inventory = (await $fetch(
      `${config?.public?.backendUrl}/api/inventory-transactions`,
      {
        method: 'POST',
        body: form
      }
    )) as Inventory

    if (inventory) {
      products.value?.push(inventory?.product)
      showDialog.value = false
      reset()
      resetError()
    }
  } catch (error: any) {
    err.value = error?.data
  }

  isFormLoading.value = false
}

function reset(): void {
  form.transaction_type = TransactionType.PURCHASE
  form.qty_change = 0
  form.unit_cost = 0
  form.total_cost = 0
  form.notes = ''
  form.product.name = ''
  form.product.description = ''
  // form.product.category_id = 0
  // form.product.brand_id = 0
  form.product.supplier_id = 0
  form.product.cost_price = 0
  form.product.selling_price = 0
  form.product.stock_qty = 0
  form.product.reorder_level = 0
  form.product.barcode = ''
}

function resetError(): void {
  err.value.errors = {}
  err.value.message = ''
}

function paginatorClick(e: PageState) {
  curPage.value = e.page + 1
  fetch()
}

function supplierChosen(payload: any): void {
  form.product.supplier_id = payload?.value?.id
}

const selectedProduct = ref({})

function edit(payload: any)  {
  selectedProduct.value = payload
  formEdit.value = payload
}

function remove() {

}
</script>
