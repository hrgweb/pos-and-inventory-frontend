<template>
  <div class="grid" style="height: 100vh">
    <div class="col-9" style="background-color: #f5f8fa">
      <div id="order-wrapper" style="height: 79vh">
        <BlockUI :blocked="pos.blocked">
          <DataTable
            scrollable
            scrollHeight="79vh"
            :value="page.orders"
            tableClass="orders"
          >
            <Column field="product.name" header="Product"></Column>
            <Column field="product.selling_price" header="Price"></Column>
            <Column field="qty" header="Qty"></Column>
            <Column field="subtotal" header="Subtotal"></Column>
            <Column>
              <template #body="{ data, index }">
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  size="small"
                  @click.prevent="pos.orderRemove(data, index)"
                />
              </template>
            </Column>
          </DataTable>
        </BlockUI>
      </div>
      <div class="bill px-3">
        <div class="flex justify-content-between pt-4 pb-2">
          <span class="text-4xl font-bold uppercase">Total</span>
          <span class="text-4xl font-bold">{{ page.pay.grandTotal }}</span>
        </div>
        <div class="flex justify-content-between pb-2">
          <span class="text-2xl font-bold uppercase">Amount</span>
          <span class="text-2xl font-bold">{{ page.pay.amount }}</span>
        </div>
        <div class="flex justify-content-between">
          <span class="text-2xl font-bold uppercase">Change</span>
          <span class="text-2xl font-bold">{{ page.pay.change }}</span>
        </div>
      </div>
    </div>

    <div class="col-3 py-3">
      <!-- <div class="products flex">
        <div
          v-for="product in products"
          :key="product.id"
          class="item flex align-items-center relative"
          style="cursor: pointer"
          @click="selectItem(product)"
        >
          <span>{{ product?.name }}</span>

          <span
            class="text-center absolute"
            style="
              bottom: 0.5em;
              background-color: green;
              padding: 0 1rem;
              border-radius: 50px;
            "
            >123</span
          >
        </div>
      </div> -->

      <div class="actions relative" style="height: 100%">
        <Button
          label="New Transaction"
          :disabled="pos.actionButtons.btnTransaction"
          @click="pos.newTransaction()"
        />
        <Button
          label="Lookup (Alt + 1)"
          id="lookup"
          :disabled="pos.actionButtons.btnLookup"
          @click="keyShortcut.itemLookup()"
        />
        <Button
          label="Void (Alt + Bspace)"
          id="void"
          :disabled="pos.actionButtons.btnVoid"
          @click="keyShortcut.openVoid()"
        />

        <!-- Pay Now-->
        <Button
          label="Pay (Alt + Enter)"
          id="pay"
          class="absolute"
          style="bottom: 0; left: 0"
          severity="info"
          :disabled="pos.actionButtons.btnPay"
          @click="keyShortcut.openPay()"
        />

        <!-- Logout -->
        <Button
          label="Logout"
          id="logout"
          style="bottom: 0; left: 0"
          severity="danger"
          @click="signOut"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="pos.showLookup"
      modal
      header="ITEM LOOKUP"
      :style="{ width: '60rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent>
        <Message
          v-if="pos.payError"
          class="mt-0"
          :closable="false"
          severity="error"
          >{{ pos.payErrorMsg }}</Message
        >

        <div class="flex flex-column gap-2">
          <span class="p-input-icon-left p-input-icon-right w-full">
            <i class="pi pi-search" />
            <InputText
              type="text"
              v-model="pos.searchByProductOrBarcode"
              class="w-full"
              id="search"
              placeholder="Type product name or scan barcode"
              @input="findByProductOrBarcodeFn"
              @keyup.enter="pos.findViaEnter"
            />
            <i class="pi pi-qrcode" />
          </span>
        </div>
      </form>
      <br />

      <DataTable
        :value="pos.lookupItems"
        tableStyle="min-width: 50rem"
        :loading="pos.isLookupLoading"
        stripedRows
        @rowClick="pos.rowClickOnItemLookup($event)"
      >
        <template #empty>
          <p class="text-center">No results found</p>
        </template>
        <Column field="barcode" header="Barcode"></Column>
        <Column field="name" header="Product Name"></Column>
        <Column field="selling_price" header="Selling Price"></Column>
        <Column field="is_available" header="Available"></Column>
      </DataTable>
    </Dialog>

    <Dialog
      v-model:visible="pos.showPay"
      modal
      header="AMOUNT"
      :style="{ width: '35rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="false"
      :draggable="false"
    >
      <form method="POST" @submit.prevent>
        <Message
          v-if="pos.payError"
          class="mt-0"
          :closable="false"
          severity="warn"
          >{{ pos.payErrorMsg }}</Message
        >

        <InputText
          id="amount"
          class="text-3xl font-bold uppercase w-full"
          v-model.number="page.pay.amount"
          @keyup.enter="pos.paid"
        />
      </form>
    </Dialog>

    <Toast position="top-left" />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { usePageStore } from '@/store/page'
import { usePosStore } from '@/store/pos'

const page = usePageStore()
const pos = usePosStore()
const keyShortcut = useKeyboardShortcuts()

definePageMeta({ layout: false, middleware: 'sanctum:auth' })

watch(
  [() => page.orders, () => page.transactionSession],
  async ([orders, transactionSession]) => {
    // orders
    if (orders?.length) {
      page.pay.grandTotal = grandTotal()
      await nextTick()
      import.meta.client && scrollToBottom()
    }

    // transactionSession
    if (!transactionSession) {
      pos.toggleStateOfButtons(true)
      pos.actionButtons.btnTransaction = false
      return
    }

    pos.toggleStateOfButtons(false)

    // disable pay button when transaction is completed
    if (
      transactionSession?.status === 'completed' ||
      transactionSession.status === 'void'
    ) {
      pos.toggleStateOfButtons(true)
      pos.actionButtons.btnTransaction = false
    }
  },
  {
    deep: true
  }
)

onMounted(() => useDashboardData())

const findByProductOrBarcodeFn = useDebounceFn(
  async () => pos.searchProduct(),
  500
)

function grandTotal(): number {
  if (page.orders.length > 0) {
    return page.orders.reduce((acc, order) => {
      const subtotal = order?.subtotal || 0

      return acc + subtotal
    }, 0)
  }

  return 0
}

function scrollToBottom() {
  const scrollingContainer = document.getElementsByClassName(
    'p-datatable-wrapper'
  )[0]

  if (scrollingContainer) {
    scrollingContainer.scrollTop = scrollingContainer.scrollHeight
  }
}

const { logout } = useSanctumAuth()

async function signOut() {
  await logout()
}
</script>

<style lang="scss">
.orders {
  height: 100%;
}

.products {
  flex-wrap: wrap;
}

.item {
  width: 170px;
  flex: 1;
  flex-basis: 180px;
  height: 130px;
  justify-content: center;
  background-color: #f1f3f4;
  border-radius: 10px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.actions {
  button {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.bill {
  span {
    color: rgb(65, 64, 64) !important;
  }
}
</style>
