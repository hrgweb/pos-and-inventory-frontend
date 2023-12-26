<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Products</h3>
      <div class="actions pb-3">
        <Button label="New Product" severity="primary" @click="newProduct" />
      </div>
    </div>

    <DataTable
      :value="product.list"
      tableStyle="min-width: 50rem"
      :loading="product.loading"
    >
      <template #header>
        <span class="p-input-icon-left w-5">
          <i class="pi pi-search" />
          <InputText
            v-model="product.search"
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
      :totalRecords="pagination.result?.meta?.total"
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
import type { Inventory, Product } from '@/types/interface/inventory'
import { TransactionType } from '@/types/enum/transactionType'
import type { Errors } from '@/types/errors'
import { useProductStore } from '@/store/product'
import { usePaginationStore } from '@/store/pagination'

const product = useProductStore()
const pagination = usePaginationStore()

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

// const inventories = ref<Inventory[]>([])
const products = ref<Product[]>([])
// const suppliers = ref<Supplier[]>([])
const showDialog = ref(false)
// const isLoading = ref(false)
const isFormLoading = ref(false)
let form = reactive<Inventory>(formData)
let formEdit = reactive<Inventory>(formData)
// let pagination: Pagination<Product> = reactive({
//   data: [],
//   meta: { total: 0 },
//   links: []
// })
// const curPage = ref(1)
let err = ref<Errors>({
  errors: {},
  message: ''
})

onMounted(() => fetch())

function fetch() {
  product.fetch().then((data) => {
    pagination.create(data)
  })
}

async function store(): Promise<void> {
  isFormLoading.value = true

  try {
    const inventory = (await $fetch<unknown>(
      `${useBackendUrl()}/api/transactions`,
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
  contact.transaction_type = TransactionType.PURCHASE
  contact.cost_price = 0
  contact.selling_price = 0
  contact.notes = ''
  contact.product.name = ''
  contact.product.description = ''
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
  //   curPage.value = e.page + 1
  //   fetch()
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
