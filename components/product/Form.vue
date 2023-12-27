<template>
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
      <InputText id="selling" v-model.number="product.contact.selling_price" />
    </div>
    <br />
    <div class="flex flex-column gap-2">
      <label for="stock_qty">Stock Qty</label>
      <InputText id="qty" v-model.number="product.contact.stock_qty" readonly />
    </div>
    <br />

    <div class="flex flex-column gap-2">
      <label for="barcode">Barcode</label>
      <InputText id="barcode" v-model="product.contact.barcode" />
    </div>
    <br />
    <div class="flex flex-column gap-2">
      <label for="reorder">Reorder Level</label>
      <InputText id="reorder" v-model.number="product.contact.reorder_level" />
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
</template>

<script lang="ts" setup></script>
