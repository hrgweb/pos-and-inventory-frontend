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
          <label for="name">Product Description</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Category Id</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Brand Id</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Supplier Id</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Cost Price</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Selling Price</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Stock Qty</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Reorder Level</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Barcode</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Transaction Type</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Qty Change</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Unit Cost</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Total Cost</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />
        <div class="flex flex-column gap-2">
          <label for="name">Notes</label>
          <InputText id="name" v-model="form.product.name" />
        </div>
        <br />

        <Button label="Save" type="submit" />
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
interface Product {
  name: ''
  description: ''
  category_id: ''
  brand_id: ''
  supplier_id: 0
  cost_price: 0
  selling_price: 0
  stock_qty: 0
  reorder_level: 0
  barcode: ''
}

interface Inventory {
  transaction_type: ''
  qty_change: 0
  unit_cost: 0
  total_cost: ''
  notes: ''
  product: Product
}

const products = ref([])
const showDialog = ref(true)
const form = reactive({
  transaction_type: '',
  qty_change: 0,
  unit_cost: 0,
  total_cost: '',
  notes: '',
  product: {
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    supplier_id: 0,
    cost_price: 0,
    selling_price: 0,
    stock_qty: 0,
    reorder_level: 0,
    barcode: ''
  }
})

const config = useRuntimeConfig()

console.log('config: ', config)

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
