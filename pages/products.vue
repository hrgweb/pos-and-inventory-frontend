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
      <Column field="cost_price" header="Cost Price"></Column>
      <Column field="selling_price" header="Selling Price"></Column>
      <Column field="stock_qty" header="Stock Qty"></Column>
      <Column header="Reorder Level">
        <template #body="{ data }">
          <Tag
            :value="data.reorder_level"
            :severity="getStatusLabel(Number(data.reorder_level), 0, 0)"
          />
        </template>
      </Column>
      <!-- <Column field="is_available" header="Available"></Column> -->
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
              @click="removing($event, slotProps.data, slotProps.index)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="10"
      :totalRecords="pagination.result?.meta?.total"
      template=" PrevPageLink CurrentPageReport NextPageLink"
      @page="pagination.click($event, fetch)"
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
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useProductStore } from '@/store/product'
import { usePaginationStore } from '@/store/pagination'
import { useConfirm } from 'primevue/useconfirm'

definePageMeta({ middleware: 'sanctum:auth' })

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

function removing(event: any, data: any, index: any): void {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: `Are you sure you want to remove '${data?.name}'?`,
    accept: () => product.removed(data, index)
  })
}

function getStatusLabel(
  qty: number,
  qtyWarningOrderLevel: number,
  qtyDangerOrderLevel: number
): string {
  if (qty <= qtyWarningOrderLevel) {
    return 'warning'
  }
  if (qty <= qtyDangerOrderLevel) {
    return 'danger'
  }
  return 'success'
}
</script>
