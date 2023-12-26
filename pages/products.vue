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
      v-model:visible="product.showDialog"
      modal
      :header="`${product.isAdd ? 'Add' : 'Edit'} Product`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST">
        <div class="flex flex-column gap-2">
          <label for="name">Product Name</label>
          <InputText id="name" v-model="product.contact.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="desc">Product Description</label>
          <InputText id="desc" v-model="product.contact.description" />
        </div>
        <br />

        <br />
        <div class="flex flex-column gap-2">
          <label for="selling">Selling Price</label>
          <InputText
            id="selling"
            v-model.number="product.contact.selling_price"
          />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="stock_qty">Stock Qty</label>
          <InputText
            id="qty"
            v-model.number="product.contact.stock_qty"
            readonly
          />
        </div>
        <br />

        <div class="flex flex-column gap-2">
          <label for="barcode">Barcode</label>
          <InputText id="barcode" v-model="product.contact.barcode" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="reorder">Reorder Level</label>
          <InputText
            id="reorder"
            v-model.number="product.contact.reorder_level"
          />
        </div>
        <br />

        <!-- Errror -->
        <SharedError
          v-if="Object.keys(product.err.errors as any).length"
          :msg="product.err?.message"
        />
        <br />

        <Button
          v-if="product.isAdd"
          label="Save Record"
          type="submit"
          :disabled="isFormLoading"
          @click.prevent="product.save"
        />
        <Button
          v-else
          label="Update Record"
          severity="warning"
          type="button"
          :disabled="isFormLoading"
          @click.prevent="product.update"
        />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { PageState } from 'primevue/paginator'
import { useProductStore } from '@/store/product'
import { usePaginationStore } from '@/store/pagination'

const product = useProductStore()
const pagination = usePaginationStore()

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

function remove() {}
</script>
