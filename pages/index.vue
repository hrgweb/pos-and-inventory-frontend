<template>
  <div class="grid">
    <div class="col-5" style="background-color: #f5f8fa">
      <div style="height: 70vh; overflow-y: auto;">
        <DataTable :value="products" tableClass="orders">
          <Column field="code" header="Items"></Column>
          <Column field="name" header="Price"></Column>
          <Column field="category" header="Qty"></Column>
          <Column field="quantity" header="Subtotal"></Column>
        </DataTable>
      </div>
      <div class="bill px-3">
        <div class="flex justify-content-between pb-2 pt-3">
          <span class="text-2xl">Discount</span>
          <span class="text-2xl font-bold">120</span>
        </div>
        <div class="flex justify-content-between pb-2">
          <span class="text-2xl">VAT</span>
          <span class="text-2xl font-bold">80</span>
        </div>
        <hr />
        <div class="flex justify-content-between pt-3">
          <span class="text-3xl">Total</span>
          <span class="text-3xl font-bold">380</span>
        </div>
      </div>
    </div>

    <div class="col-7 px-4">
      <div class="pb-3">
        <span class="p-input-icon-left p-input-icon-right w-full">
          <i class="pi pi-search" />
          <InputText
            type="text"
            v-model="search"
            class="w-full"
            placeholder="Type product name or scan barcode"
          />
          <i class="pi pi-qrcode" />
        </span>
      </div>

      <div class="products flex">
        <div v-for="n in 35" class="item flex align-items-center relative">
          <span>Tanduay Rhum</span>

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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ProductService } from '@/service/ProductService'

onMounted(() => {
  ProductService.getProducts().then((data) => (products.value = data))
})

const products = ref()
const search = ref('')
</script>

<style lang="scss">
.bill {
}

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
</style>
