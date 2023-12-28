<template>
  <Message :severity="severity" @close="closed">{{ msg }}</Message>
</template>

<script lang="ts" setup>
import { useInventoryStore } from '@/store/inventory'

const inventory = useInventoryStore()

defineProps({
  msg: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    default: 'error'
  }
})

function closed() {
  Object.assign(inventory.err, {
    errors: {},
    message: ''
  })
}
</script>
