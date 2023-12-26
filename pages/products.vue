<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Products</h3>
      <div class="actions pb-3">
        <Button label="New Product" severity="primary" @click="newProduct" />
      </div>
    </div>

    <DataTable
      :value="inventories"
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
      <Column field="product.barcode" header="Barcode"></Column>
      <Column field="product.name" header="Name"></Column>
      <Column field="product.description" header="Description"></Column>
      <Column field="product.selling_price" header="Selling Price"></Column>
      <Column field="product.stock_qty" header="Stock Qty"></Column>
      <Column field="product.reorder_level" header="Reorder Level"></Column>
      <Column field="product.is_available" header="Available"></Column>
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
            <Button
              icon="pi pi-pencil"
              class="mr-1"
              label="Edit"
              severity="warning"
              size="small"
              @click="edit(slotProps.data)"
            />
            <Button
              label="Remove"
              severity="error"
              size="small"
              @click="remove"
            />
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
      :header="`${isAdd ? 'Add' : 'Edit'} Product`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent="store">
        <div class="flex flex-column gap-2">
          <label for="name">Product Name</label>
          <InputText id="name" v-model="contact.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="desc">Product Description</label>
          <InputText id="desc" v-model="contact.product.description" />
        </div>
        <br />
        <!-- <div class="flex flex-column gap-2">
            <label for="category">Category Id</label>
            <InputText id="category" v-model.number="contact.product.category_id" />
          </div>
          <br /> -->
        <!-- <div class="flex flex-column gap-2">
            <label for="brand">Brand Id</label>
            <InputText id="brand" v-model.number="contact.product.brand_id" />
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
          <InputText id="cost" v-model.number="contact.product.cost_price" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="selling">Selling Price</label>
          <InputText
            id="selling"
            v-model.number="contact.product.selling_price"
          />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="qty"> Qty</label>
          <InputText id="qty" v-model.number="contact.product.stock_qty" />
        </div>
        <br />

        <div class="flex flex-column gap-2">
          <label for="barcode">Barcode</label>
          <InputText id="barcode" v-model="contact.product.barcode" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="reorder">Reorder Level</label>
          <InputText
            id="reorder"
            v-model.number="contact.product.reorder_level"
          />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="transaction_type">Transaction Type</label>
          <Dropdown
            v-model="contact.transaction_type"
            :options="transactionTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a City"
            class="w-full"
          />
        </div>
        <br />

        <div class="flex flex-column gap-2">
          <label for="notes">Notes</label>
          <InputText id="notes" v-model="contact.notes" />
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
import type { Supplier } from '@/types/interface/supplier'
import { TransactionType } from '@/types/enum/transactionType'
import type { Pagination } from '@/types/pagination'
import type { Errors } from '@/types/errors'

const formData = {
  transaction_type: TransactionType.PURCHASE,
  qty: 0,
  cost_price: 0,
  selling_price: 0,
  subtotal: 0,
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
}

const inventories = ref<Inventory[]>([])
const products = ref<Product[]>([])
const suppliers = ref<Supplier[]>([])
const showDialog = ref(false)
const isLoading = ref(false)
const isFormLoading = ref(false)
let form = reactive<Inventory>(formData)
let formEdit = reactive<Inventory>(formData)
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
  fetch()
})

const search = ref('')

async function fetch(): Promise<void> {
  isLoading.value = true

  try {
    const paginate = (await $fetch(`${useBackendUrl()}/api/transactions`, {
      query: { page: curPage.value, search: search.value }
    })) as Pagination

    pagination.value = paginate
    inventories.value = paginate?.data
  } catch (error) {
    console.log(error)
  }

  isLoading.value = false
}

async function store(): Promise<void> {
  isFormLoading.value = true

  try {
    const inventory = (await $fetch(`${useBackendUrl()}/api/transactions`, {
      method: 'POST',
      body: form
    })) as Inventory

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
  contact.transaction_type = TransactionType.PURCHASE
  contact.cost_price = 0
  contact.selling_price = 0
  contact.notes = ''
  contact.product.name = ''
  contact.product.description = ''
  contact.product.supplier_id = 0
  contact.product.cost_price = 0
  contact.product.selling_price = 0
  contact.product.stock_qty = 0
  contact.product.reorder_level = 0
  contact.product.barcode = ''
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
const isAdd = ref(false)
const isEdit = ref(false)
let contact = reactive<Inventory>(formData)

watchImmediate([() => isAdd.value, () => isEdit.value], ([add, edit]) => {
  if (add) contact = form
  if (edit) contact = formEdit
})

function newProduct() {
  showDialog.value = true
  isAdd.value = true
  isEdit.value = false
}

function edit(payload: any) {
  selectedProduct.value = payload
  formEdit = payload
  showDialog.value = true
  isAdd.value = false
  isEdit.value = true
}

function remove() {}
</script>
