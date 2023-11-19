<template>
    <div class="grid">
        <div class="col-5">
            <DataTable :value="products" tableStyle="min-width: 50rem">
                <Column field="code" header="Items"></Column>
                <Column field="name" header="Price"></Column>
                <Column field="category" header="Qty"></Column>
                <Column field="quantity" header="Subtotal"></Column>
            </DataTable>

            <div class="bil">
                <div class="flex justify-content-between pb-2 pt-3">
                    <span class="text-2xl ">Discount</span>
                    <span class="text-2xl font-bold">120</span>
                </div>
                <div class="flex justify-content-between pb-2">
                    <span class="text-2xl ">VAT</span>
                    <span class="text-2xl font-bold">80</span>
                </div>
                <hr>
                <div class="flex justify-content-between pt-3">
                    <span class="text-3xl ">Total</span>
                    <span class="text-3xl font-bold">380</span>
                </div>
            </div>
        </div>

        <div class="col-7">
            2
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref();

</script>