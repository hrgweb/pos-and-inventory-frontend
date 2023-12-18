<template>
  <div>
    <h3>Inventory</h3>

    <div class="actions pb-3">
      <Button
        label="New Product"
        severity="primary"
        @click="showDialog = true"
      />
    </div>

    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="quantity" header="Quantity"></Column>
    </DataTable>

    <Dialog
      v-model:visible="showDialog"
      modal
      header="New Product"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :dismissableMask="true"
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
        <div class="flex flex-column gap-2">
          <label for="category">Category Id</label>
          <InputText id="category" v-model.number="form.product.category_id" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="brand">Brand Id</label>
          <InputText id="brand" v-model.number="form.product.brand_id" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="supplier">Supplier Id</label>
          <InputText id="supplier" v-model.number="form.product.supplier_id" />
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
          <InputText id="transaction_type" v-model="form.transaction_type" />
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
        <br />

        <Button label="Save" type="submit" />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
interface Product {
  name: string
  description: string
  category_id: number | string
  brand_id: number
  supplier_id: number
  cost_price: number
  selling_price: number
  stock_qty: number
  reorder_level: number
  barcode: string
}

interface Inventory {
  transaction_type: string
  qty_change: number
  unit_cost: number
  total_cost: string
  notes: string
  product: Product
}

const products = ref([])
const showDialog = ref(true)
const form = reactive({
  transaction_type: '',
  qty_change: null,
  unit_cost: null,
  total_cost: '',
  notes: '',
  product: {
    name: '',
    description: '',
    category_id: null,
    brand_id: null,
    supplier_id: null,
    cost_price: null,
    selling_price: null,
    stock_qty: null,
    reorder_level: null,
    barcode: ''
  }
})

const config = useRuntimeConfig()

function store() {
  try {
    const product = $fetch(
      `${config?.public?.backendUrl}/api/inventory-transactions`,
      {
        method: 'POST',
        body: form
      }
    )

    console.log('result: ', product)
  } catch (error) {
    console.log(error)
  }
}
</script>
