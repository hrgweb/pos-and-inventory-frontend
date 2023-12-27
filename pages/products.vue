<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Products</h3>
      <div class="actions pb-3">
        <Button label="New Product" severity="primary" @click="product.add" />
      </div>
    </div>

    <DataTable
      :value="product.list"
      tableStyle="min-width: 50rem"
      :loading="product.loading"
      dataKey="id"
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
      <Column field="barcode" header="Barcode"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="description" header="Description"></Column>
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
            <Button
              icon="pi pi-pencil"
              class="mr-1"
              severity="info"
              size="small"
              @click="product.edit(slotProps.data, slotProps.index)"
            />
            <Button
              icon="pi pi-times"
              severity="danger"
              size="small"
              @click="removing($event)"
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
      v-model:visible="product.showDialog"
      modal
      :header="`${product.isAdd ? 'Add' : 'Edit'} Product`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <!-- Form -->
      <ProductForm :form="product.contact" :is-form-loading="isFormLoading" />
    </Dialog>

    <ConfirmPopup group="headless">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="bg-gray-900 text-white border-round p-3">
          <span>{{ message.message }}</span>
          <div class="flex align-items-center gap-2 mt-3">
            <Button
              label="Save"
              @click="acceptCallback"
              size="small"
              outlined
            ></Button>
            <Button
              label="Cancel"
              outlined
              @click="rejectCallback"
              size="small"
              text
            ></Button>
          </div>
        </div>
      </template>
    </ConfirmPopup>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { PageState } from 'primevue/paginator'
import { useProductStore } from '@/store/product'
import { usePaginationStore } from '@/store/pagination'
import { useConfirm } from 'primevue/useconfirm'

const product = useProductStore()
const pagination = usePaginationStore()
const confirm = useConfirm()

const isFormLoading = ref(false)

onMounted(() => fetch())

function fetch() {
  product.fetch().then((data) => {
    pagination.create(data)
  })
}

function paginatorClick(e: PageState) {
  //   curPage.value = e.page + 1
  //   fetch()
}

function removing(event: any): void {
  console.log(event)

  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: 'Are you sure? You cannot undo this.',
    accept: () => {
      alert('accepted')
    },
    reject: () => {
      alert('rejected')
    }
  })
}
</script>
