<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Suppliers</h3>
      <div class="actions pb-3">
        <Button label="New Supplier" severity="primary" @click="supplier.add" />
      </div>
    </div>

    <DataTable :value="supplier.list" tableStyle="min-width: 50rem">
      <template #header>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="supplier.search"
            placeholder="Search by supplier"
          />
        </span>
      </template>
      <Column field="name" header="Name"></Column>
      <Column field="description" header="Description"></Column>
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
              @click="supplier.edit(slotProps.data, slotProps.index)"
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
      @page="pagination.click"
    ></Paginator>

    <Dialog
      v-model:visible="supplier.showDialog"
      modal
      header="New Supplier"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent="supplier.save">
        <div class="flex flex-column gap-2">
          <label for="name">Name</label>
          <InputText id="name" v-model="supplier.contact.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="desc">Description</label>
          <InputText id="desc" v-model="supplier.contact.description" />
        </div>
        <br />

        <!-- Errror -->
        <SharedError
          v-if="Object.keys(supplier.err.errors as any).length"
          :msg="supplier.err?.message"
          @closed="supplier.errorHandler"
        />
        <br />

        <Button
          v-if="supplier.isAdd"
          label="Save Record"
          type="submit"
          :disabled="isFormLoading"
          @click.prevent="supplier.save"
        />
        <Button
          v-else
          label="Update Record"
          severity="warning"
          type="button"
          :disabled="isFormLoading"
          @click.prevent="supplier.update"
        />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useSupplierStore } from '@/store/supplier'
import { usePaginationStore } from '@/store/pagination'

definePageMeta({ middleware: 'sanctum:auth' })

const supplier = useSupplierStore()
const pagination = usePaginationStore()
const confirm = useConfirm()

onMounted(() => fetch())

const isFormLoading = ref(false)

onMounted(() => fetch())

function fetch() {
  supplier.fetch().then((data) => {
    pagination.create(data)
  })
}

function removing(event: any, data: any, index: any): void {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: `Are you sure you want to remove '${data?.name}'?`,
    accept: () => supplier.removed(data, index)
  })
}
</script>
