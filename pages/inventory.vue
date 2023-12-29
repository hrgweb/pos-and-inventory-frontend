<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Inventory</h3>
      <div class="actions pb-3">
        <Button
          label="New Inventory"
          severity="primary"
          @click="inventory.add"
        />
      </div>
    </div>

    <DataTable
      :value="inventory.list"
      tableStyle="min-width: 50rem"
      :loading="inventory.loading"
      dataKey="id"
    >
      <template #header>
        <span class="p-input-icon-left w-5">
          <i class="pi pi-search" />
          <InputText
            v-model="inventory.search"
            class="w-full"
            placeholder="Search by product name or barcode"
            @keyup.enter="fetch"
          />
        </span>
      </template>
      <Column field="product.barcode" header="Barcode"></Column>
      <Column field="product.name" header="Name"></Column>
      <Column field="product.description" header="Description"></Column>
      <Column field="product.cost_price" header="Cost Price"></Column>
      <Column field="product.selling_price" header="Selling Price"></Column>
      <Column field="product.stock_qty" header="Stock Qty"></Column>
      <Column field="product.reorder_level" header="Reorder Level"></Column>
      <Column field="product.is_available" header="Available"></Column>
      <Column field="transaction_type" header="Transaction Type"></Column>
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
              @click="inventory.edit(slotProps.data, slotProps.index)"
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
      v-model:visible="inventory.showDialog"
      modal
      :header="`${inventory.isAdd ? 'Add' : 'Edit'} Inventory`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST">
        <div class="flex flex-column gap-2">
          <label for="product">Product</label>
          <Dropdown
            v-model="inventory.contact.product"
            :options="inventory.products"
            optionLabel="name"
            placeholder="Select a product"
            class="w-full"
          />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="cost">Cost Price</label>
          <InputText id="cost" v-model.number="inventory.contact.cost_price" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="qty">Qty</label>
          <InputText id="qty" v-model.number="inventory.contact.qty" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="selling">Selling Price</label>
          <InputText
            id="selling"
            v-model.number="inventory.contact.selling_price"
          />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="stock_qty">Subtotal</label>
          <InputText
            id="qty"
            :value="inventory.contact?.cost_price * inventory.contact?.qty"
            readonly
          />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="transaction_type">Transaction Type</label>
          <Dropdown
            v-model="inventory.contact.transaction_type"
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
          <InputText id="notes" v-model="inventory.contact.notes" />
        </div>

        <!-- Errror -->
        <SharedError
          v-if="Object.keys(inventory.err?.errors as any).length"
          :msg="inventory.err?.message"
          @closed="inventory.errorHandler"
        />
        <br />

        <Button
          v-if="inventory.isAdd"
          label="Save Record"
          type="submit"
          :disabled="inventory.loadingForm"
          @click.prevent="inventory.save"
        />
        <Button
          v-else
          label="Update Record"
          severity="warning"
          type="button"
          :disabled="isFormLoading"
          @click.prevent="inventory.update"
        />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { transactionTypes } from '@/data/transactionTypes'
import { useInventoryStore } from '@/store/inventory'
import { usePaginationStore } from '@/store/pagination'

definePageMeta({ middleware: 'sanctum:auth' })

const inventory = useInventoryStore()
const pagination = usePaginationStore()
const confirm = useConfirm()

const isFormLoading = ref(false)

onMounted(() => {
  inventory.data()
  fetch()
})

function fetch() {
  inventory.fetch().then((data) => {
    pagination.create(data)
  })
}

function removing(event: any, data: any, index: any): void {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: `Are you sure you want to remove '${data?.product?.name}'?`,
    accept: () => inventory.removed(data, index)
  })
}
</script>
