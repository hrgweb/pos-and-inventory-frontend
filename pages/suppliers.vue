<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <h3>Suppliers</h3>
      <div class="actions pb-3">
        <Button
          label="New Supplier"
          severity="primary"
          @click="showDialog = true"
        />
      </div>
    </div>

    <DataTable :value="suppliers" tableStyle="min-width: 50rem">
      <template #header>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="search" placeholder="Search" />
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
      header="New Supplier"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent="store">
        <div class="flex flex-column gap-2">
          <label for="name">Name</label>
          <InputText id="name" v-model="form.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="desc">Description</label>
          <InputText id="desc" v-model="form.description" />
        </div>
        <br />

        <Button label="Save" type="submit" />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { PageState } from 'primevue/paginator'
import type { Supplier } from '@/types/interface/supplier'
import type { Pagination } from '@/types/pagination'

const search = ref('')
const suppliers = ref<Supplier[]>([])
const showDialog = ref(false)
const isLoading = ref(false)
let form = reactive<Supplier>({
  name: '',
  description: ''
})
const pagination = ref<Pagination>({
  data: [],
  meta: { total: 0 },
  links: []
})
const curPage = ref(1)

onMounted(() => fetch())

const config = useRuntimeConfig()

async function fetch(): Promise<void> {
  isLoading.value = true

  try {
    const paginate = (await $fetch(
      `${config?.public?.backendUrl}/api/suppliers`,
      { query: { page: curPage.value } }
    )) as Pagination

    if (paginate?.data?.length) {
      isLoading.value = false
      pagination.value = paginate
      suppliers.value = paginate?.data
    }
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

async function store(): Promise<void> {
  isLoading.value = true

  try {
    const supplier = (await $fetch(
      `${config?.public?.backendUrl}/api/suppliers`,
      {
        method: 'POST',
        body: form
      }
    )) as Supplier

    if (supplier) {
      isLoading.value = false
      suppliers.value?.push(supplier)
      showDialog.value = false
      reset()
    }
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

function reset(): void {
  form.name = ''
  form.description = ''
}

function paginatorClick(e: PageState) {
  curPage.value = e.page + 1
  fetch()
}
</script>
