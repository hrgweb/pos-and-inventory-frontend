<template>
  <form method="POST">
    <div class="flex flex-column gap-2">
      <label for="name">Product Name</label>
      <InputText id="name" v-model="form.name" />
    </div>
    <br />
    <div class="flex flex-column gap-2">
      <label for="desc">Product Description</label>
      <InputText id="desc" v-model="form.description" />
    </div>
    <br />
    <div class="flex flex-column gap-2">
      <label for="cost">Cost Price</label>
      <InputText id="cost" v-model.number="form.cost_price" />
    </div>
    <br />
    <div class="flex flex-column gap-2">
      <label for="selling">Selling Price</label>
      <InputText id="selling" v-model.number="form.selling_price" />
    </div>
    <br />
    <!-- <div class="flex flex-column gap-2">
      <label for="stock_qty">Stock Qty</label>
      <InputText id="qty" v-model.number="form.stock_qty" readonly />
    </div>
    <br /> -->
    <div class="flex flex-column gap-2">
      <label for="barcode">Barcode</label>
      <InputText id="barcode" v-model="form.barcode" />
    </div>
    <br />
    <div class="flex flex-column gap-2">
      <label for="reorder">Reorder Level</label>
      <InputText id="reorder" v-model.number="form.reorder_level" />
    </div>
    <br />

    <!-- Errror -->
    <SharedError
      v-if="Object.keys(product.err.errors as any).length"
      :msg="product.err?.message"
      @closed="product.errorHandler"
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
</template>

<script lang="ts" setup>
import type { Product } from '@/types/interface/inventory'
import { useProductStore } from '@/store/product'

const product = useProductStore()

defineProps<{
  form: Product
  isFormLoading: boolean
}>()
</script>
